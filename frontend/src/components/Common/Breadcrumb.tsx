import { ArrowLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"

import { Link } from "react-router-dom"

export interface BreadcrumbItem {
    link?: string | null,
    title: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {

    const truncateIfLong = (text: string, length: number) => {
        return text.length > length ? text.substring(0, length) + "..." : text;
    }

    return (<>
        <nav className="hidden md:flex py-3 mt-2 md:mt-6 w-full text-gray-700 rounded-lg dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-1">
                {items.map((item, i) => (
                    <li key={i} className="flex items-center">
                        {item.link ? (
                            <Link key={i} to={item.link} className="flex items-center text-gray-700 hover:text-blue-600">
                                {truncateIfLong(item.title, 20)}
                            </Link>
                        ) : (
                            <span key={i} className="bg-blue-50 px-4 py-2 rounded-lg flex items-center text-blue-600" aria-current="page">
                                {item.title}
                            </span>
                        )}
                        {i < items.length - 1 ? (
                            <ChevronRightIcon className="flex-shrink-0 w-4 h-4 ml-1 text-gray-400" aria-hidden="true" />
                        ) : (<></>)}
                    </li>
                ))}
            </ol>
        </nav >
        <div className="flex md:hidden">
            <Link className="flex bg-gray-50 border px-4 py-2 rounded-lg items-center text-gray-600 hover:bg-gray-100" to={items[items.length - 2].link || ""}>
                <ArrowLeftIcon className="flex-shrink-0 w-4 h-4 mr-2 text-gray-600" aria-hidden="true" />
                {items[items.length - 2].title}
            </Link>
        </div>
    </>)
}

export default Breadcrumb