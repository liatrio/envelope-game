variable "agent_count" {
  default     = 1
  description = "Amount of nodes for the envelope-game aks cluster"
}

variable "cluster_name" {
  default     = "envelope-game"
  description = "name of aks cluster"
}

variable "dns_prefix" {
  default = "envelope-game"
}

variable "resource_group_location" {
  default     = "westus"
  description = "Location of the resource group."
}

variable "resource_group_name" {
  default     = "envelope-game-rg"
  description = "Name of the resource group"
}

variable "tenant_id" {
  sensitive   = true
  description = "Tenant ID for service principal being used for the azure provider"
}

variable "client_secret" {
  sensitive   = true
  description = "secret for service principal being used for the azure provider"
}

variable "app_id" {
  sensitive   = true
  description = "App ID for service principal being used for the azure provider"
}

variable "sandbox_subscription" {
  sensitive   = true
  description = "Subscription ID being used for creating resources for the envelope game"
}

variable "db_user" {
  sensitive   = true
  description = "MySQL database admin user to be used for MySQL Server in azure"
}

variable "db_secret" {
  sensitive   = true
  description = "MySQL database admin secret to be used for MySQL Server in azure"
}

variable "namespace_name" {
  sensitive   = true
  type        = string
  description = "Kubernetes namespace used in the AKS cluster used by the Helm Deployment for Azure"
}
