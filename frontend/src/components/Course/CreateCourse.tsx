//import { MinusIcon, PlusIcon, PhotoIcon } from '@heroicons/react/24/solid'
import React, { useEffect } from 'react'

import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { useCreateCourseMutation } from '../../features/courses/courseApiSlice'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

// TODO delete this file

const CreateCourse = () => {

    //const [groups, setGroups] = useState<string[]>([]);
    //const [image, setImage] = useState(null);
    const [createCourse] = useCreateCourseMutation()
    const [description, setDescription] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [title, setTitle] = useState("New course")
    const navigate = useNavigate()

    useEffect(() => {
        setErrMsg("")
    }, [title, description])

    const handleTitleInput = (e: any) => {
        setTitle(e.target.value ? e.target.value : "New course")
    }

    const handleDescriptionInput = (e: any) => {
        setDescription(e.target.value)
    }

    /*

    const handleGroupsInput = (e: any) => {
        setGroups(e.target.value)
    }

    const handleAddGroup = (e: any) => {
        setGroups([...groups, ""]);
    }
    

    const handleGroupChange = (index: number, value: string) => {
        const updatedGroups = [...groups];
        updatedGroups[index] = value;
        setGroups(updatedGroups);
    }

    const handleRemoveGroup = (index: number) => {
        const updatedGroups = [...groups];
        updatedGroups.splice(index, 1);
        setGroups(updatedGroups);
    }

    const handleImageChange = (e: any) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    }

    */

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (title && description) { //&& groups 
            try {
                const newCourse: any = await createCourse({ title, description });
                navigate(`/course/${newCourse.data.id}`);
            } catch (err) {
                console.log(err);
                setErrMsg("An error occurred while trying to create the course.");
            }
        } else {
            setErrMsg("Please fill in all fields.");
        }
    }

    return (
        <>
            <div className="container mx-auto">
                <Link to="/course" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center my-4 md:my-6">
                    <ChevronLeftIcon className="h-5 w-5" />
                    Back to courses
                </Link>
                <div className="mx-auto bg-gray-200 rounded-xl md:rounded-3xl shadow-lg shadow-gray-400/50 p-4 md:p-6 md:h-auto flex flex-col items-center justify-center w-5/6">

                    <h1 className="text-3xl font-semibold mb-4">
                        {title === "New course" ? (
                            <span className="text-gray-500">{title}</span>
                        ) : (
                            <span className="text-black-500">{title}</span>
                        )}
                    </h1>
                    <p className="text-red-500 mb-4">{errMsg}</p>
                    <form className="w-full">
                        {/*
                        <div className="flex flex-col mb-6">
                            <label className="m-1 md:m-2 text-gray-500 font-bold">Course Image</label>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    placeholder="No file selected"
                                    className="border border-gray-300 w-full rounded-lg py-2 px-4 flex-grow focus:outline-none focus:border-blue-500 mr-1"
                                    readOnly
                                />
                                <label className="inline-block items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600">
                                    <span className="mx-1 md:mx-2 md:block hidden">
                                        Upload
                                    </span>
                                    <span className="mx-1 md:mx-2 block md:hidden">
                                        <PhotoIcon className="h-5 w-5" />
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                        */}
                        <div className="mb-6">
                            <label className="block text-gray-500 font-bold">Course title</label>
                            <input
                                type="text"
                                placeholder="Enter title"
                                onChange={handleTitleInput}
                                autoComplete="off"
                                className={`border ${errMsg ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg py-2 px-4 w-full focus:outline-none focus:border-blue-500`}
                                required
                            />
                            <p className="text-gray-500 text-sm">Give a short title to your course.</p>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-500 font-bold">Course description</label>
                            <textarea
                                value={description}
                                rows={5}
                                placeholder="Enter description"
                                className={`border ${errMsg ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg py-2 px-4 w-full focus:outline-none focus:border-blue-500`}
                                onChange={handleDescriptionInput}
                                required
                            />
                            {description.trim().length > 0 && (
                                <div className="my-4 p-4 bg-white rounded-lg shadow-md w-full flex items-center">
                                    <ReactMarkdown className="text-gray-800">{description}</ReactMarkdown>
                                </div>
                            )}
                            <div className="my-2 mx-1 px-4 py-2 alert bg-blue-200 border-blue-400 text-blue-700 flex items-center rounded-lg">
                                <InformationCircleIcon className="w-6 h-6 m-2" />
                                <p className="text-sm">
                                    Markdown supported!{' '}
                                    <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noreferrer" className="text-blue-500 underline">
                                        See reference
                                    </a>
                                </p>
                            </div>
                        </div>
                        {/*<div className="flex flex-wrap mx-auto mb-6 justify-center w-full">
                        <div className="w-full px-2 py-4">
                            <label className="block text-gray-700 w-12 text-gray-500 font-bold">Group</label>
                                <div className="flex flex-wrap items-center">
                                    {groups.map((group, index) => (
                                    <div className="flex items-center" key={index}>
                                        <input
                                        type="text"
                                        placeholder=""
                                        className={`border ${
                                            errMsg ? 'border-red-500' : 'border-gray-300'
                                            } py-2 px-4 flex-grow focus:outline-none focus:border-blue-500 w-24 ml-2 rounded-lg`}
                                        value={group}
                                        required
                                        onChange={(e) => handleGroupChange(index, e.target.value)}
                                        maxLength={3}
                                        />
                                            {index > 0 && (
                                            <button
                                                type="button"
                                                className="bg-red-500 text-white w-8 h-8 rounded-full text-sm hover:bg-red-600 flex items-center ml-2 align-middle justify-center"
                                                onClick={() => handleRemoveGroup(index)}
                                            >
                                                <MinusIcon/>
                                            </button>
                                            )}
                                    </div>
                                    ))}
                                        <button
                                            type="button"
                                            className="bg-blue-500 text-white w-8 h-8 rounded-full text-sm hover:bg-blue-600 flex items-center ml-2 align-middle justify-center"
                                            onClick={handleAddGroup}
                                        >
                                            <PlusIcon/>
                                        </button>
                                </div>
                        </div>  
                    </div>
                    */}
                    </form>
                </div>
                <div className="mx-auto rounded-3xl shadow-lg shadow-gray-400/50 md:h-auto flex flex-col mt-4 md:mt-6 w-5/6">
                    <button
                        type="submit"
                        className="bg-gray-200 border border-gray-200 p-2 mt-2 md:mt-6 hover:bg-gray-100 transition duration-300 rounded-full flex items-center justify-center text-gray-700 font-bold"
                        onClick={handleSubmit}
                    >
                        Create course
                    </button>
                </div>
            </div>
        </>
    )
}

export default CreateCourse