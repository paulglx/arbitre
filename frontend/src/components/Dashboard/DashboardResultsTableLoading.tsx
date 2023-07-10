import React from 'react'

const DashboardResultsTableLoading = () => {
    return (
        <div className='mx-auto overflow-x-auto rounded-md animate-pulse'>
            <table className="w-full text-sm rounded border">
                <thead className="text-gray-800 bg-gray-100 rounded-lg">
                    <tr>
                        <th className="w-10 py-3">
                            <div className="h-3 my-2 ml-2 bg-gray-300 rounded-full w-24"></div>
                        </th>
                        <th className="w-24">
                            <div className="h-3 my-2 ml-2 bg-gray-300 rounded-full w-24"></div>
                        </th>
                        <th className="w-24">
                            <div className="h-3 my-2 ml-2 bg-gray-300 rounded-full w-24"></div>
                        </th>
                        <th className="w-24">
                            <div className="h-3 my-2 ml-2 bg-gray-300 rounded-full w-24"></div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-t">
                        <td className="px-2 bg-gray-50 border-r border-gray-200 py-4">
                            <div className="h-3 bg-gray-300 rounded-full w-12"></div>
                        </td>
                        <td className="px-2 py-4">
                            <div className="h-3 ml-2 bg-gray-100 border border-gray-300 rounded w-12"></div>
                        </td>
                        <td className="px-2 py-4">
                            <div className="h-3 ml-2 bg-gray-100 border border-gray-300 rounded w-12"></div>
                        </td>
                        <td className="px-2 py-4">
                            <div className="h-3 ml-2 bg-gray-100 border border-gray-300 rounded w-12"></div>
                        </td>
                    </tr>
                    <tr className="border-t">
                        <td className="px-2 py-4 bg-gray-50 border-r border-gray-200">
                            <div className="h-3 bg-gray-300 rounded-full w-12"></div>
                        </td>
                        <td className="px-2 py-4">
                            <div className="h-3 ml-2 bg-gray-100 border border-gray-300 rounded w-12"></div>
                        </td>
                        <td className="px-2 py-4">
                            <div className="h-3 ml-2 bg-gray-100 border border-gray-300 rounded w-12"></div>
                        </td>
                        <td className="px-2 py-4">
                            <div className="h-3 ml-2 bg-gray-100 border border-gray-300 rounded w-12"></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default DashboardResultsTableLoading