import AdminLayout from '../../components/admin/AdminLayout'
import { Settings } from 'lucide-react'

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Settings Coming Soon
          </h3>
          <p className="text-gray-600">
            Store settings and configuration options will be available in the next update.
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
