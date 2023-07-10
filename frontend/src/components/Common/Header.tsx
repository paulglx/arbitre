import { AcademicCapIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { selectCurrentUser, selectIsTeacher } from '../../features/auth/authSlice'

import Dropdown from './Dropdown';
import { Link } from "react-router-dom";
import { logOut } from '../../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { useKeycloak } from '@react-keycloak/web'
import { useSelector } from 'react-redux'

const Header = () => {

    const username = useSelector(selectCurrentUser)
    const isTeacher = useSelector(selectIsTeacher)
    const dispatch = useDispatch()
    const { keycloak } = useKeycloak()

    const signout = async () => {
        dispatch(logOut({}))
        keycloak.logout({
            redirectUri: window.location.origin + '/'
        })
    }

    return (
        <header className="bg-gray-50 border-b border-gray-200">
            <div className="container mx-auto flex py-2 flex-wrap md:p-2 md:px-6 lg:px-14 xl:px-20 2xl:px-28 flex-row items-center">
                <a className="font-black items-center text-gray-800 mb-0" href="/">
                    <span className="ml-3 text-xl">ARBITRE</span>
                </a>
                <nav className="mr-auto ml-0 md:ml-4 py-1 pl-4 md:border-l md:border-gray-800 flex flex-wrap items-center text-base justify-center">
                    <Link to="/course" className="mr-5 text-gray-800 hover:text-gray-800">
                        Courses
                    </Link>
                    {isTeacher ? (
                        <Link to="/dashboard" className="mr-5 text-gray-800 hover:text-gray-800">
                            Dashboard
                        </Link>
                    ) : null}
                </nav>
                <div className="dropdown flex-wrap items-center text-base justify-center relative">
                    <Dropdown
                        title={username}
                        titleClassName="hidden sm:block"
                        icon={isTeacher ?
                            <AcademicCapIcon className="text-white sm:mr-2 w-6 h-6 items" />
                            :
                            <UserCircleIcon className="text-white sm:mr-2 w-6 h-6 items" />
                        }
                        elements={[
                            {
                                name: "Sign Out",
                                action: signout
                            }
                        ]}
                    />
                </div>
            </div>
        </header>
    )
}

export default Header