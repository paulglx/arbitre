import { ChevronRightIcon } from "@heroicons/react/24/solid"
import { Link } from "react-router-dom"

export interface BreadcrumbItem {
    link: string | null,
    title: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {

    const truncateIfLong = (text: string, length: number) => {
        return text.length > length ? text.substring(0, length) + "..." : text;
    }

    return (
        <nav className="flex px-5 py-3 mt-2 md:mt-6 w-full text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-1">
                {items.map((item, i) => (<>
                    <li key={i} className="flex items-center">
                        {item.link ? (
                            <Link to={item.link} className="flex items-center text-gray-700 hover:text-blue-600">
                                {truncateIfLong(item.title, 20)}
                            </Link>
                        ) : (
                            <span className="flex items-center text-gray-500" aria-current="page">
                                {item.title}
                            </span>
                        )}
                    </li>
                    {i < items.length - 1 ? (
                        <ChevronRightIcon className="flex-shrink-0 w-4 h-4 text-gray-400" aria-hidden="true" />
                    ) : (<></>)}
                </>))}
            </ol>
        </nav >
    )
}

export default Breadcrumb