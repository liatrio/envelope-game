terraform {
  required_version = ">=1.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

provider "azurerm" {
  features {}

  subscription_id = var.sandbox_subscription
  client_id       = var.app_id
  client_secret   = var.client_secret
  tenant_id       = var.tenant_id
}

provider "kubernetes" {
  host                   = azurerm_kubernetes_cluster.envelope-game.kube_config.0.host
  username               = azurerm_kubernetes_cluster.envelope-game.kube_config.0.username
  password               = azurerm_kubernetes_cluster.envelope-game.kube_config.0.password
  client_certificate     = base64decode(azurerm_kubernetes_cluster.envelope-game.kube_config.0.client_certificate)
  client_key             = base64decode(azurerm_kubernetes_cluster.envelope-game.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.envelope-game.kube_config.0.cluster_ca_certificate)
}
