'use client';
import { useState, useEffect } from 'react';

interface Device {
  ip: string;
  mac: string;
  status: string;
}

export default function NetworkDashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res = await fetch(' https://freezable-quickness-fall.ngrok-free.dev/api/scan')
      const data = await res.json();
      setDevices(data);
    } catch (err) {
      console.log("Failed to scan network:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">LAN Device Monitor</h1>
        <button 
          onClick={fetchDevices} 
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Scanning Subnet..." : "Refresh Scan"}
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">IP Address</th>
              <th className="p-3">MAC Address</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  {loading ? "Detecting machines..." : "No devices found."}
                </td>
              </tr>
            ) : (
              devices.map((device, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono">{device.ip}</td>
                  <td className="p-3 font-mono text-gray-600">{device.mac}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                      {device.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}