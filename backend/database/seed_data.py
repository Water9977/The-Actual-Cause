import time
import logging
from backend.database.client import db_manager
from backend.database.schema import initialize_schema
from backend.config import settings

logger = logging.getLogger("synapse.seed")

def seed_enterprise_graph(graph_name: str = settings.FALKORDB_MASTER_GRAPH):
    """
    Seeds FalkorDB with the canonical 'Silent Poison Migration' enterprise topology,
    historical postmortems, git commits, RFCs, and cascading dependencies.
    """
    logger.info(f"Seeding enterprise knowledge graph '{graph_name}'...")
    client = db_manager.connect()
    g = client.select_graph(graph_name)
    
    # Clean old graph state
    try:
        g.delete()
        logger.info(f"Purged existing graph '{graph_name}' for clean seed.")
    except Exception:
        pass

    # Ensure indexes are established
    initialize_schema(graph_name)
    
    current_time_ms = int(time.time() * 1000)
    four_hours_ago_ms = current_time_ms - (4 * 60 * 60 * 1000)
    two_days_ago_ms = current_time_ms - (48 * 60 * 60 * 1000)
    six_months_ago_ms = current_time_ms - (180 * 24 * 60 * 60 * 1000)

    # Cypher Seed Mutation Script
    seed_cypher = f"""
    // 1. Teams
    CREATE (t_core:Team {{id: 'team-infra', name: 'Core Infrastructure Squad', slack_channel: '#eng-infra', oncall_rotation_id: 'rot_infra_p0'}})
    CREATE (t_checkout:Team {{id: 'team-checkout', name: 'Checkout & Payments Squad', slack_channel: '#eng-checkout', oncall_rotation_id: 'rot_checkout_p0'}})
    CREATE (t_order:Team {{id: 'team-order', name: 'Order Processing Squad', slack_channel: '#eng-orders', oncall_rotation_id: 'rot_order_p1'}})
    CREATE (t_sre:Team {{id: 'team-sre', name: 'Platform Reliability Squad', slack_channel: '#sre-incident-room', oncall_rotation_id: 'rot_sre_tier1'}})

    // 2. People (Engineers & Leaders)
    CREATE (p_elena:Person {{id: 'usr_elena', email: 'elena.rostova@enterprise.internal', name: 'Elena Rostova', role: 'Staff Systems Architect', pagerduty_id: 'PD_ELENA_99', slack_handle: '@elena.arch', pagerank_score: 0.91}})
    CREATE (p_dave:Person {{id: 'usr_dave', email: 'dave.chen@enterprise.internal', name: 'Dave Chen', role: 'Junior Frontend Engineer', pagerduty_id: 'PD_DAVE_12', slack_handle: '@dave.ui', pagerank_score: 0.12}})
    CREATE (p_alex:Person {{id: 'usr_alex', email: 'alex.mercer@enterprise.internal', name: 'Alex Mercer', role: 'Staff Backend Engineer', pagerduty_id: 'PD_ALEX_44', slack_handle: '@alex.m', pagerank_score: 0.78}})
    CREATE (p_sarah:Person {{id: 'usr_sarah', email: 'sarah.connor@enterprise.internal', name: 'Sarah Connor', role: 'Principal SRE', pagerduty_id: 'PD_SARAH_01', slack_handle: '@sarah.sre', pagerank_score: 0.85}})
    CREATE (p_marcus:Person {{id: 'usr_marcus', email: 'marcus.vance@enterprise.internal', name: 'Marcus Vance', role: 'VP of Engineering', pagerduty_id: 'PD_MARCUS_00', slack_handle: '@marcus.v', pagerank_score: 0.45}})

    // Team Affiliations
    CREATE (p_elena)-[:MEMBER_OF {{is_primary_oncall: false}}]->(t_core)
    CREATE (p_dave)-[:MEMBER_OF {{is_primary_oncall: true}}]->(t_checkout)
    CREATE (p_alex)-[:MEMBER_OF {{is_primary_oncall: false}}]->(t_order)
    CREATE (p_sarah)-[:MEMBER_OF {{is_primary_oncall: false}}]->(t_sre)

    // 3. Services & System Topology
    CREATE (s_checkout:Service {{id: 'svc_checkout', name: 'CheckoutService', tier: 1, current_health: 'CRITICAL', repo_url: 'github.com/enterprise/checkout-service', language: 'TypeScript/Node', slo_target: 99.99, systemic_fragility_index: 0.84}})
    CREATE (s_order:Service {{id: 'svc_order', name: 'OrderService', tier: 1, current_health: 'DEGRADED', repo_url: 'github.com/enterprise/order-service', language: 'Go', slo_target: 99.95, systemic_fragility_index: 0.72}})
    CREATE (s_pricing:Service {{id: 'svc_pricing', name: 'PricingService', tier: 1, current_health: 'CRITICAL', repo_url: 'github.com/enterprise/pricing-service', language: 'Rust', slo_target: 99.99, systemic_fragility_index: 0.95}})
    CREATE (s_inventory:Service {{id: 'svc_inventory', name: 'InventoryService', tier: 2, current_health: 'HEALTHY', repo_url: 'github.com/enterprise/inventory-service', language: 'Python', slo_target: 99.90, systemic_fragility_index: 0.35}})
    CREATE (s_auth:Service {{id: 'svc_auth', name: 'AuthGateway', tier: 1, current_health: 'HEALTHY', repo_url: 'github.com/enterprise/auth-gateway', language: 'Go', slo_target: 99.99, systemic_fragility_index: 0.91}})

    // Ownership Edges
    CREATE (t_checkout)-[:OWNS]->(s_checkout)
    CREATE (t_order)-[:OWNS]->(s_order)
    CREATE (t_core)-[:OWNS]->(s_pricing)
    CREATE (t_core)-[:OWNS]->(s_inventory)
    CREATE (t_sre)-[:OWNS]->(s_auth)

    // 4. Infrastructure Components
    CREATE (i_redis:Infrastructure {{id: 'infra_pricing_redis', name: 'PricingRedisCluster', type: 'Redis', region: 'us-east-1', cluster: 'prod-core-data', capacity_limit: '16GB'}})
    CREATE (i_rds:Infrastructure {{id: 'infra_postgres_orders', name: 'PostgresOrdersPrimary', type: 'RDS', region: 'us-east-1', cluster: 'prod-db-aurora', capacity_limit: '500GB'}})
    CREATE (i_kafka:Infrastructure {{id: 'infra_kafka_events', name: 'KafkaOrderEvents', type: 'KafkaTopic', region: 'us-east-1', cluster: 'prod-event-bus', capacity_limit: '100MB/s'}})

    // 5. Causal Runtime Dependencies (Topological DAG)
    CREATE (s_checkout)-[:CALLS {{protocol: 'gRPC', timeout_ms: 2500, circuit_breaker_active: false}}]->(s_order)
    CREATE (s_order)-[:CALLS {{protocol: 'gRPC', timeout_ms: 1200, circuit_breaker_active: false}}]->(s_pricing)
    CREATE (s_order)-[:CALLS {{protocol: 'HTTP', timeout_ms: 3000, circuit_breaker_active: true}}]->(s_inventory)
    CREATE (s_pricing)-[:DEPENDS_ON {{pool_size: 100, max_connections: 500, connection_timeout_ms: 500}}]->(i_redis)
    CREATE (s_order)-[:DEPENDS_ON {{pool_size: 50, max_connections: 200}}]->(i_rds)
    CREATE (s_order)-[:DEPENDS_ON]->(i_kafka)

    // 6. Architectural Decision Records (RFCs)
    CREATE (dec_rfc308:Decision {{id: 'dec_rfc_308', rfc_number: 308, title: 'Enforce Strict Price Consistency Across Regions', status: 'ACCEPTED', approved_at: '{two_days_ago_ms}', rationale: 'Prevent customer price arbitrage by setting maxmemory-policy to noeviction in Pricing Redis cluster, eliminating stale cached discounts.'}})

    // 7. Git Pull Requests and Commits
    CREATE (pr_1482:PullRequest {{id: 'pr_1482', number: 1482, repo: 'pricing-service', title: 'Enforce Strict Price Accuracy (RFC-308): Change maxmemory-policy to noeviction', merged_at: '{four_hours_ago_ms}', diff_url: 'github.com/enterprise/pricing-service/pull/1482', ast_change_summary: 'Modified redis.conf maxmemory-policy parameter from volatile-lru to noeviction'}})
    CREATE (c_e7f9:Commit {{id: 'cmt_e7f9', hash: 'e7f9a2c4180', message: 'Set maxmemory-policy noeviction in pricing cluster config', timestamp: {four_hours_ago_ms}, lines_added: 4, lines_deleted: 1, changed_files: 'config/redis.conf'}})

    // PR Authorship and Implementation Linkages
    CREATE (pr_1482)-[:AUTHORED_BY {{timestamp: {four_hours_ago_ms}}}]->(p_elena)
    CREATE (pr_1482)-[:REVIEWED_BY {{approval_type: 'APPROVED'}}]->(p_alex)
    CREATE (pr_1482)-[:IMPLEMENTS]->(dec_rfc308)
    CREATE (c_e7f9)-[:PART_OF]->(pr_1482)
    CREATE (s_pricing)-[:DEPLOYED_FROM {{environment: 'production', deployed_at: '{four_hours_ago_ms}'}}]->(c_e7f9)

    // 8. Active Production Incident & Alert Trigger
    CREATE (alt_9912:Alert {{id: 'alt_9912', name: 'CheckoutService HTTP 504 Gateway Timeout Spike', severity: 'P0', metric_name: 'p99_latency', threshold: '5000ms', observed_value: '18420ms', status: 'FIRING', triggered_at: '{current_time_ms}'}})
    CREATE (inc_7702:Incident {{id: 'INC-7702', title: 'CheckoutService Outage: Gateway Timeouts on Credit Card Charge', severity: 'P0', status: 'TRIAGING', started_at: '{current_time_ms}'}})
    CREATE (alt_9912)-[:FIRED_ON]->(s_checkout)
    CREATE (inc_7702)-[:TRIGGERED_BY]->(alt_9912)

    // 9. Historical Episodic Memory (Past Post-Mortem & Verified Playbook)
    CREATE (pm_2025_08:PostMortem {{id: 'pm_2025_08', incident_id: 'INC-4102', timeline_summary: 'Redis memory saturation with noeviction caused write starvation in Pricing worker threads, backing up upstream order queues.', lessons_learned: 'Never run noeviction on shared caching tiers without automated fallback to volatile-lru under memory pressure.', published_at: '{six_months_ago_ms}'}})
    CREATE (pb_redis:Playbook {{id: 'pb_redis_evict', title: 'Emergency Redis Memory Policy Hot-Patch', target_service: 'PricingRedisCluster', automated_remediation_script: 'CONFIG SET maxmemory-policy volatile-lru'}})

    CREATE (pm_2025_08)-[:ANALYZED]->(i_redis)
    CREATE (pb_redis)-[:REMEDIES]->(i_redis)
    CREATE (pb_redis)-[:REMEDIES]->(s_pricing)
    """

    start_time = time.perf_counter()
    g.query(seed_cypher)
    seed_duration_ms = (time.perf_counter() - start_time) * 1000.0

    logger.info(f"Successfully seeded '{graph_name}' in {seed_duration_ms:.2f}ms.")
    return True

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    seed_enterprise_graph()
