resource "kubernetes_namespace" "envelope-game-namespace" {
  metadata {
    labels = azurerm_resource_group.envelope-game-rg.tags

    name = var.namespace_name
  }
  depends_on = [
    azurerm_kubernetes_cluster.envelope-game,
  ]
}
