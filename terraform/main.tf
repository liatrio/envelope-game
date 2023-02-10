resource "azurerm_resource_group" "envelope-game-rg" {
  location = var.resource_group_location
  name     = var.resource_group_name
  tags = {
    Client      = "Internal"
    Project     = "Flywheel"
    Environment = "Test"
    Application = "Envelope Game"
  }
}

resource "azurerm_kubernetes_cluster" "envelope-game" {
  location            = azurerm_resource_group.envelope-game-rg.location
  name                = var.cluster_name
  resource_group_name = azurerm_resource_group.envelope-game-rg.name
  dns_prefix          = var.dns_prefix
  tags = {
    Client      = azurerm_resource_group.envelope-game-rg.tags.Client
    Project     = azurerm_resource_group.envelope-game-rg.tags.Project
    Environment = azurerm_resource_group.envelope-game-rg.tags.Environment
    Application = azurerm_resource_group.envelope-game-rg.tags.Application
  }

  default_node_pool {
    name       = "agentpool"
    vm_size    = "Standard_D2_v2"
    node_count = var.agent_count
  }

  service_principal {
    client_id     = var.app_id
    client_secret = var.client_secret
  }
}

resource "azurerm_mysql_server" "envelope-game-db" {
  name                = "envelope-game"
  location            = azurerm_resource_group.envelope-game-rg.location
  resource_group_name = azurerm_resource_group.envelope-game-rg.name

  administrator_login          = var.db_user
  administrator_login_password = var.db_secret

  sku_name   = "GP_Gen5_2"
  storage_mb = 5120
  version    = "5.7"

  auto_grow_enabled                 = true
  backup_retention_days             = 7
  geo_redundant_backup_enabled      = false
  infrastructure_encryption_enabled = false
  public_network_access_enabled     = true
  ssl_enforcement_enabled           = false
  ssl_minimal_tls_version_enforced  = "TLSEnforcementDisabled"

  tags = {
    Client      = azurerm_resource_group.envelope-game-rg.tags.Client
    Project     = azurerm_resource_group.envelope-game-rg.tags.Project
    Environment = azurerm_resource_group.envelope-game-rg.tags.Environment
    Application = azurerm_resource_group.envelope-game-rg.tags.Application
  }
}

resource "azurerm_mysql_database" "envelope-game-test" {
  name                = "envelope-game"
  resource_group_name = azurerm_resource_group.envelope-game-rg.name
  server_name         = azurerm_mysql_server.envelope-game-db.name
  charset             = "utf8"
  collation           = "utf8_unicode_ci"
}

resource "azurerm_public_ip" "envelope-game-pip" {
  name                = "envelope-game-pip"
  resource_group_name = azurerm_resource_group.envelope-game-rg.name
  location            = azurerm_resource_group.envelope-game-rg.location
  allocation_method   = "Static"
  sku                 = "Standard"
  tags = {
    Client      = azurerm_resource_group.envelope-game-rg.tags.Client
    Project     = azurerm_resource_group.envelope-game-rg.tags.Project
    Environment = azurerm_resource_group.envelope-game-rg.tags.Environment
    Application = azurerm_resource_group.envelope-game-rg.tags.Application
  }
}
