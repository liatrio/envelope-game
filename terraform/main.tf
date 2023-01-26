resource "azurerm_resource_group" "envelope-game-rg" {
  location = var.resource_group_location
  name     = var.resource_group_name
}

resource "azurerm_kubernetes_cluster" "envelope-game-cluster" {
  location            = azurerm_resource_group.envelope-game-rg.location
  name                = var.cluster_name
  resource_group_name = azurerm_resource_group.envelope-game-rg.name
  dns_prefix          = var.dns_prefix
  tags = {
    Client      = "Internal"
    Project     = "Flywheel"
    Environment = "Test"
    Application = "Envelope Game"
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
