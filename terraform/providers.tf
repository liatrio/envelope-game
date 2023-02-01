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
