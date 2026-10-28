'use client'

import { useState, useEffect } from 'react'
import { Package, AlertTriangle, Clock, TrendingUp, MapPin, Plus, Filter, Download, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useInventory } from '@/hooks/useInventory'
import { useAuth } from '@/hooks/useAuth'
import { useProducts } from '@/hooks/useProducts'
import { InventoryLot, InventoryMovement, InventoryAnalytics, StockAlert } from '@/types/inventory'
import { cn } from '@/lib/utils'

interface InventoryDashboardProps {
  className?: string
}

export function InventoryDashboard({ className }: InventoryDashboardProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddLotDialogOpen, setIsAddLotDialogOpen] = useState(false)
  const [analytics, setAnalytics] = useState<InventoryAnalytics | null>(null)
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  
  const [newStock, setNewStock] = useState({
    skuId: '',
    quantity: '',
    expiry: '',
    locationId: '',
    batchNumber: '',
    supplier: '',
    costPrice: '',
  })
  const [isAddingStock, setIsAddingStock] = useState(false)

  const { isAuthenticated } = useAuth()
  const { products, fetchProducts } = useProducts()
  const { 
    lots, 
    movements, 
    locations, 
    isLoading, 
    loadInventoryLots,
    loadInventoryMovements,
    loadInventoryLocations,
    loadInventoryAnalytics,
    loadStockAlerts,
    createInventoryLot
  } = useInventory()

  useEffect(() => {
    if (isAuthenticated) {
      loadInventoryLots()
      loadInventoryMovements()
      loadInventoryLocations()
      fetchProducts({ merchant: 'current' })
      loadInventoryAnalytics().then((data) => setAnalytics(data?.analytics as any || null)).catch(console.error)
      loadStockAlerts().then((data) => setAlerts(data?.alerts as any || [])).catch(console.error)
    }
  }, [isAuthenticated, loadInventoryLots, loadInventoryMovements, loadInventoryLocations, fetchProducts, loadInventoryAnalytics, loadStockAlerts])

  const availableSkus = products?.flatMap(product => 
    (product.skus || []).map(sku => ({
      id: sku.id,
      label: `${product.name} - ${sku.name || sku.unitType} (${sku.unitIncrement} ${sku.unitType})`,
      unitType: sku.unitType
    }))
  ) || []

  const handleAddStock = async () => {
    if (!newStock.skuId || !newStock.quantity) {
      alert('Please select a SKU and enter a valid quantity')
      return
    }
    setIsAddingStock(true)
    try {
      await createInventoryLot({
        skuId: newStock.skuId,
        quantity: parseFloat(newStock.quantity),
        expiry: newStock.expiry || undefined,
        locationId: newStock.locationId || undefined,
        batchNumber: newStock.batchNumber || undefined,
        supplier: newStock.supplier || undefined,
        costPrice: newStock.costPrice ? Math.round(parseFloat(newStock.costPrice) * 100) : undefined,
      })
      setIsAddLotDialogOpen(false)
      setNewStock({
        skuId: '',
        quantity: '',
        expiry: '',
        locationId: '',
        batchNumber: '',
        supplier: '',
        costPrice: '',
      })
      loadInventoryLots()
    } catch (err: any) {
      console.error('Failed to add stock lot:', err)
      alert(err?.message || 'Failed to add stock lot')
    } finally {
      setIsAddingStock(false)
    }
  }

  const filteredLots = (lots || []).filter(lot => {
    const matchesLocation = selectedLocation === 'all' || lot.locationId === selectedLocation
    const skuName = lot.sku?.name?.toLowerCase() || ''
    const productName = lot.sku?.product?.name?.toLowerCase() || ''
    const query = searchQuery.toLowerCase()
    const matchesSearch = searchQuery === '' || 
      skuName.includes(query) ||
      productName.includes(query)
    return matchesLocation && matchesSearch
  })

  const getStockStatus = (quantity: number, unitType: string) => {
    if (quantity === 0) return { status: 'out', color: 'bg-red-100 text-red-800', label: 'Out of Stock' }
    if (quantity < 10) return { status: 'low', color: 'bg-yellow-100 text-yellow-800', label: 'Low Stock' }
    return { status: 'good', color: 'bg-green-100 text-green-800', label: 'In Stock' }
  }

  const getExpiryStatus = (expiry?: string) => {
    if (!expiry) return { status: 'none', color: 'bg-gray-100 text-gray-800', label: 'No Expiry' }
    
    const expiryDate = new Date(expiry)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry < 0) return { status: 'expired', color: 'bg-red-100 text-red-800', label: 'Expired' }
    if (daysUntilExpiry <= 7) return { status: 'expiring', color: 'bg-orange-100 text-orange-800', label: 'Expiring Soon' }
    return { status: 'good', color: 'bg-green-100 text-green-800', label: 'Fresh' }
  }

  if (!isAuthenticated) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Please Login</h3>
          <p className="text-muted-foreground text-center mb-4">
            You need to be logged in to access inventory management
          </p>
          <Button onClick={() => window.location.href = '/login'}>
            Login to Continue
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Inventory Management</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your inventory, track stock levels, and monitor movements
          </p>
        </div>
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddLotDialogOpen} onOpenChange={setIsAddLotDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Stock</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sku">Select Product SKU *</Label>
                  <Select 
                    value={newStock.skuId} 
                    onValueChange={(val) => setNewStock(prev => ({ ...prev, skuId: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={availableSkus.length === 0 ? "No product variants found" : "Choose a product variant"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSkus.map((sku) => (
                        <SelectItem key={sku.id} value={sku.id}>
                          {sku.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    min="0.1" 
                    step="0.1"
                    placeholder="Enter quantity" 
                    value={newStock.quantity}
                    onChange={(e) => setNewStock(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="expiry">Expiry Date (Optional)</Label>
                  <Input 
                    id="expiry" 
                    type="date" 
                    value={newStock.expiry}
                    onChange={(e) => setNewStock(prev => ({ ...prev, expiry: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Select 
                    value={newStock.locationId} 
                    onValueChange={(val) => setNewStock(prev => ({ ...prev, locationId: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a storage location" />
                    </SelectTrigger>
                    <SelectContent>
                      {(locations && locations.length > 0 ? locations : [
                        { id: 'main-store', name: 'Main Storefront / Warehouse' },
                        { id: 'addis-storage', name: 'Addis Ababa Central Storage' }
                      ]).map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="batchNumber">Batch Number (Optional)</Label>
                  <Input 
                    id="batchNumber" 
                    placeholder="e.g. BATCH-2026-001" 
                    value={newStock.batchNumber}
                    onChange={(e) => setNewStock(prev => ({ ...prev, batchNumber: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="supplier">Supplier (Optional)</Label>
                  <Input 
                    id="supplier" 
                    placeholder="Enter supplier name" 
                    value={newStock.supplier}
                    onChange={(e) => setNewStock(prev => ({ ...prev, supplier: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="costPrice">Cost Price in ETB (Optional)</Label>
                  <Input 
                    id="costPrice" 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    value={newStock.costPrice}
                    onChange={(e) => setNewStock(prev => ({ ...prev, costPrice: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" onClick={() => setIsAddLotDialogOpen(false)} disabled={isAddingStock}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStock} disabled={isAddingStock}>
                    {isAddingStock ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Add Stock'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">ETB {(analytics.totalValue / 100).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.totalQuantity} total units
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{analytics.lowStockItems}</div>
              <p className="text-xs text-muted-foreground">
                Need restocking
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{analytics.expiringSoonItems}</div>
              <p className="text-xs text-muted-foreground">
                Within 7 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{analytics.expiredItems}</div>
              <p className="text-xs text-muted-foreground">
                Need disposal
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stock Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={alert.sku.product.images[0] || '/placeholder-product.jpg'}
                      alt={alert.sku.product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{alert.sku.product.name}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {alert.type.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : filteredLots.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No inventory found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLots.map((lot) => {
                    const unit = lot.sku?.unitType || 'PIECE'
                    const stockStatus = getStockStatus(lot.quantity, unit)
                    const expiryStatus = getExpiryStatus(lot.expiry)
                    
                    return (
                      <div key={lot.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <img
                            src={lot.sku?.product?.images?.[0] || '/placeholder-product.jpg'}
                            alt={lot.sku?.product?.name || lot.sku?.name || 'Product'}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium">{lot.sku?.product?.name || 'Product'}</h4>
                            <p className="text-sm text-muted-foreground">{lot.sku?.name || 'Default Variant'}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={stockStatus.color}>
                                {stockStatus.label}
                              </Badge>
                              <Badge className={expiryStatus.color}>
                                {expiryStatus.label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {lot.quantity} {unit.toLowerCase()}
                          </p>
                          {lot.location && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {lot.location.name}
                            </p>
                          )}
                          {lot.batchNumber && (
                            <p className="text-xs text-muted-foreground">
                              Batch: {lot.batchNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : movements.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No movements found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {movements.slice(0, 10).map((movement) => (
                    <div key={movement.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          movement.type === 'IN' ? 'bg-green-100 text-green-600' :
                          movement.type === 'OUT' ? 'bg-red-100 text-red-600' :
                          'bg-gray-100 text-gray-600'
                        )}>
                          {movement.type === 'IN' ? '+' : movement.type === 'OUT' ? '-' : '±'}
                        </div>
                        <div>
                          <h4 className="font-medium">{movement.lot?.sku?.product?.name || movement.lot?.sku?.name || 'Product'}</h4>
                          <p className="text-sm text-muted-foreground">
                            {movement.type} - {movement.quantity} {(movement.lot?.sku?.unitType || 'piece').toLowerCase()}
                          </p>
                          {movement.reason && (
                            <p className="text-xs text-muted-foreground">{movement.reason}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {new Date(movement.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(movement.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Locations</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : locations.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No locations found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {locations.map((location) => (
                    <div key={location.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium">{location.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{location.address}</p>
                      <Badge variant={location.isActive ? 'default' : 'secondary'}>
                        {location.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
