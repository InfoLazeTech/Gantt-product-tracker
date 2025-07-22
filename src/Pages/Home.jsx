import React from 'react'

const Home = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-indigo-700 mb-2">Welcome to TimeLine-Chart</h2>
        <p className="text-gray-600 text-lg">Track your processes, recipes, and purchase orders with ease.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-50 rounded-lg p-6 shadow flex flex-col items-center">
          <span className="text-4xl font-bold text-indigo-600 mb-2">12</span>
          <span className="text-gray-700">Active Processes</span>
        </div>
        <div className="bg-orange-50 rounded-lg p-6 shadow flex flex-col items-center">
          <span className="text-4xl font-bold text-orange-500 mb-2">8</span>
          <span className="text-gray-700">Recipes</span>
        </div>
        <div className="bg-gray-100 rounded-lg p-6 shadow flex flex-col items-center">
          <span className="text-4xl font-bold text-gray-700 mb-2">5</span>
          <span className="text-gray-700">Purchase Orders</span>
        </div>
      </div>
    </div>
  )
}

export default Home