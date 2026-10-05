import time
import logging
from typing import Optional, Any
from falkordb import FalkorDB
from backend.config import settings

logger = logging.getLogger("synapse.database")

class FalkorDBManager:
    _instance: Optional["FalkorDBManager"] = None
    _client: Optional[FalkorDB] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FalkorDBManager, cls).__new__(cls)
        return cls._instance

    def connect(self) -> FalkorDB:
        """Establish or return the active connection to FalkorDB."""
        if self._client is None:
            try:
                if settings.FALKORDB_URL:
                    self._client = FalkorDB.from_url(settings.FALKORDB_URL)
                    logger.info("Connected to FalkorDB Cloud via URL")
                else:
                    auth_kwargs = {}
                    if settings.FALKORDB_USERNAME:
                        auth_kwargs["username"] = settings.FALKORDB_USERNAME
                    if settings.FALKORDB_PASSWORD:
                        auth_kwargs["password"] = settings.FALKORDB_PASSWORD
                    if settings.FALKORDB_SSL:
                        auth_kwargs["ssl"] = True

                    self._client = FalkorDB(
                        host=settings.FALKORDB_HOST,
                        port=settings.FALKORDB_PORT,
                        **auth_kwargs
                    )
                    logger.info(f"Connected to FalkorDB at {settings.FALKORDB_HOST}:{settings.FALKORDB_PORT}")
            except Exception as e:
                logger.error(f"Failed to connect to FalkorDB: {e}")
                raise e
        return self._client

    def is_connected(self) -> bool:
        """Health check verifying FalkorDB connectivity."""
        try:
            client = self.connect()
            # Run a lightweight test query on master graph
            g = client.select_graph(settings.FALKORDB_MASTER_GRAPH)
            g.query("RETURN 1")
            return True
        except Exception:
            return False

    def get_master_graph(self):
        """Retrieve the canonical master enterprise knowledge graph."""
        client = self.connect()
        return client.select_graph(settings.FALKORDB_MASTER_GRAPH)

    def get_scratchpad_graph(self, incident_id: str):
        """Retrieve or create an isolated ephemeral scratchpad for an active incident."""
        client = self.connect()
        clean_id = incident_id.replace("-", "_").lower()
        return client.select_graph(f"scratchpad_{clean_id}")

    def list_graphs(self) -> list[str]:
        """List all active graphs in this FalkorDB instance."""
        try:
            client = self.connect()
            return client.list_graphs()
        except Exception as e:
            logger.error(f"Error listing graphs: {e}")
            return []

    def delete_graph(self, graph_name: str) -> bool:
        """Purge an ephemeral scratchpad graph from memory."""
        try:
            client = self.connect()
            g = client.select_graph(graph_name)
            g.delete()
            logger.info(f"Deleted graph '{graph_name}' from FalkorDB")
            return True
        except Exception as e:
            logger.error(f"Failed to delete graph '{graph_name}': {e}")
            return False

    def query(self, graph_name: str, cypher: str, params: Optional[dict[str, Any]] = None) -> tuple[list[Any], float]:
        """
        Execute a Cypher query with precise microsecond execution latency tracking.
        Returns: (result_set, latency_ms)
        """
        client = self.connect()
        g = client.select_graph(graph_name)
        
        start_time = time.perf_counter()
        if params:
            result = g.query(cypher, params)
        else:
            result = g.query(cypher)
        latency_ms = (time.perf_counter() - start_time) * 1000.0
        
        return result.result_set, latency_ms

db_manager = FalkorDBManager()
