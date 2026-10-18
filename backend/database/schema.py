import logging
from backend.database.client import db_manager
from backend.config import settings

logger = logging.getLogger("synapse.schema")

INDEX_STATEMENTS = [
    # Primary Range Indexes for O(1) Lookups & Join Keys
    "CREATE INDEX FOR (s:Service) ON (s.name)",
    "CREATE INDEX FOR (s:Service) ON (s.id)",
    "CREATE INDEX FOR (i:Infrastructure) ON (i.name)",
    "CREATE INDEX FOR (i:Infrastructure) ON (i.id)",
    "CREATE INDEX FOR (a:Alert) ON (a.id)",
    "CREATE INDEX FOR (a:Alert) ON (a.status)",
    "CREATE INDEX FOR (c:Commit) ON (c.hash)",
    "CREATE INDEX FOR (pr:PullRequest) ON (pr.number)",
    "CREATE INDEX FOR (p:Person) ON (p.email)",
    "CREATE INDEX FOR (p:Person) ON (p.name)",
    "CREATE INDEX FOR (inc:Incident) ON (inc.id)",
    "CREATE INDEX FOR (dec:Decision) ON (dec.id)",
    "CREATE INDEX FOR (pm:PostMortem) ON (pm.id)",
]

FULLTEXT_INDEXES = [
    ("Commit", ["message"]),
    ("PullRequest", ["title"]),
    ("Decision", ["title", "rationale"]),
    ("PostMortem", ["timeline_summary", "lessons_learned"]),
]

def initialize_schema(graph_name: str = settings.FALKORDB_MASTER_GRAPH):
    """Initializes indexes on the designated FalkorDB graph."""
    logger.info(f"Initializing schema and indexes on graph '{graph_name}'...")
    g = db_manager.connect().select_graph(graph_name)
    
    # 1. Create standard Range Indexes
    for stmt in INDEX_STATEMENTS:
        try:
            g.query(stmt)
            logger.info(f"Executed: {stmt}")
        except Exception as e:
            # FalkorDB raises error if index already exists
            if "already exists" in str(e).lower() or "redundant" in str(e).lower():
                logger.debug(f"Index already exists for: {stmt}")
            else:
                logger.warning(f"Notice on index creation '{stmt}': {e}")

    # 2. Create Full-Text Indexes via RediSearch procedure
    for label, fields in FULLTEXT_INDEXES:
        try:
            field_args = ", ".join([f"'{f}'" for f in fields])
            ft_query = f"CALL db.idx.fulltext.createNodeIndex('{label}', {field_args})"
            g.query(ft_query)
            logger.info(f"Full-text index created on {label} for fields {fields}")
        except Exception as e:
            if "already exists" in str(e).lower() or "redundant" in str(e).lower():
                logger.debug(f"Full-text index on {label} already exists.")
            else:
                logger.warning(f"Notice on full-text index for {label}: {e}")

    logger.info(f"Schema initialization complete for graph '{graph_name}'.")
    return {"status": "complete", "graph": graph_name}

init_schema = initialize_schema

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    initialize_schema()
