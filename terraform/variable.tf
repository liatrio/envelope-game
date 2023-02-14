variable "agent_count" {
  default = 1
}

# The following two variable declarations are placeholder references.
# Set the values for these variable in terraform.tfvars
variable "aks_service_principal_app_id" {
  default = ""
}

variable "aks_service_principal_client_secret" {
  default = ""
}

variable "cluster_name" {
}

variable "dns_prefix" {
}

variable "resource_group_location" {
  default     = "eastus"
  description = "Location of the resource group."
}

variable "resource_group_name" {
  description = "Name of the resource group"
}

variable "ssh_public_key" {
  default = "~/.ssh/id_rsa.pub"
}

variable "tenant_id" {
  sensitive = true
}

variable "client_secret" {
  sensitive = true
}

variable "app_id" {
  sensitive = true
}

variable "sandbox_subscription" {
  sensitive = true
}

variable "db_user" {
  sensitive = true
}

variable "db_secret" {
  sensitive = true
}

variable "namespace_name" {
  sensitive = true
  type      = string
}
