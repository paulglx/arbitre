import { Button, Container, Form } from 'react-bootstrap'
import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown';

import { useCreateCourseMutation } from '../../features/courses/courseApiSlice'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ChevronLeftIcon, MinusIcon, PhotoIcon, PlusIcon } from '@heroicons/react/24/solid'


const CreateCourse = () => {

    const [image, setImage] = useState(null);
    const [title, setTitle] = useState("New course")
    const [description, setDescription] = useState("")
    const [groups, setGroups] = useState<string[]>([]);
    const [numSessions, setNumSessions] = useState(0)

    const [errMsg, setErrMsg] = useState("")
    const [createCourse] = useCreateCourseMutation()
    const navigate = useNavigate()
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setErrMsg("")
    }, [title, description])

    const handleTitleInput = (e: any) => {
        setTitle(e.target.value ? e.target.value : "New course")
    }

    const handleDescriptionInput = (e: any) => {
        setDescription(e.target.value)
    }

    const handleGroupsInput = (e:any) => {
        setGroups(e.target.value)
    }

    const handleNumSessions = (e:any) => {
        setNumSessions(e.target.value)
    }
    const handleAddGroup = (e:any) => {
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

    const validateForm = () => {
        const newErrors : any = {};
      
        if (!title) {
          newErrors.title = 'Please enter a title';
        }
      
        if (!description) {
          newErrors.description = 'Please enter a description';
        }
      
        if (!groups) {
          newErrors.groups = 'Please enter a group';
        }
      
        if (!numSessions) {
          newErrors.numSessions = 'Please enter the number of sessions';
        }
      
      
        setErrors(newErrors);
      
        return Object.keys(newErrors).length === 0;
    }
      
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (title && description && groups && numSessions) {
          try {
            const newCourse: any = await createCourse({ title, description });
            navigate(`/course/${newCourse?.id}`);
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
            <a href="/course" className="inline-flex bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline items-center m-4 md:m-6">
                <ChevronLeftIcon className="h-5 w-5" /> 
                Back to courses
            </a>
            <div className="mx-auto bg-gray-200 rounded-3xl shadow-lg shadow-gray-400/50 p-4 md:p-6 md:h-auto flex flex-col w-5/6">
                
                <h1 className="text-3xl font-semibold mb-4">
                {title === "New course" ? (
                    <span className="text-gray-500">{title}</span>
                ) : (
                    <span className="text-black-500">{title}</span>
                )}
                </h1>
                <p className="text-red-500 mb-4">{errMsg}</p>
                <form>
                    <div className="flex flex-col mb-6">
                        <label className="text-gray-700 m-1 md:m-2 text-gray-500 font-bold">Course Image</label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="No file selected"
                                className="border border-gray-300 rounded-lg py-2 px-4 flex-grow focus:outline-none focus:border-blue-500 m-1 md:m-2"
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
                    <div className="mb-6">
                        <label className="block text-gray-700 m-1 md:m-2 text-gray-500 font-bold">Course title</label>
                        <input
                            type="text"
                            placeholder="Enter title"
                            onChange={handleTitleInput}
                            autoComplete="off"
                            className={`border ${
                                errMsg ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg py-2 px-4 w-full focus:outline-none focus:border-blue-500 m-1 md:m-2`}
                            required
                        />
                        <p className="text-gray-500 text-sm m-1 md:m-2">Give a short title to your course.</p>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 m-1 md:m-2 text-gray-500 font-bold">Course description</label>
                        <textarea
                            value={description}
                            rows={5}
                            placeholder="Enter description"
                            className={`border ${
                            errMsg ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg py-2 px-4 w-full focus:outline-none focus:border-blue-500 m-1 md:m-2`}
                            onChange={handleDescriptionInput}
                            required
                        />
                        <div className="mt-2">
                            <ReactMarkdown>{description}</ReactMarkdown>
                        </div>
                        <p className="text-gray-500 text-sm m-1 md:m-2">
                            Markdown supported!{' '}
                            <a href="https://www.markdownguide.org/basic-syntax/" className="text-blue-500">
                                See reference
                            </a>
                        </p>
                    </div>
                    <div className="flex flex-wrap -mx-2 mb-6">
                        <div className="w-full sm:w-1/2 px-2">
                            <label className="block text-gray-700 m-1 md:m-2 text-gray-500 font-bold">Number of Sessions</label>
                            <input
                                value={numSessions}
                                type="number"
                                onChange={handleNumSessions}
                                placeholder="Enter number of sessions"
                                className={`border ${
                                    errMsg ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg py-2 px-4 w-full focus:outline-none focus:border-blue-500 m-1 md:m-2`}
                                required
                            />
                        </div>
                        <div className="w-full sm:w-1/2 px-2">
                            <label className="block text-gray-700 m-1 md:m-2 text-gray-500 font-bold">ETCS</label>
                            <input
                                type="number"
                                placeholder="Enter ETCS of course"
                                className={`border ${
                                    errMsg ? 'border-red-500' : 'border-gray-300'
                                    }  rounded-lg py-2 px-4 w-full focus:outline-none focus:border-blue-500 m-1 md:m-2`}
                                required
                            />
                        </div>
                        <div className="w-full px-2">
                                <label className="block text-gray-700 w-12 m-1 md:m-2 text-gray-500 font-bold">Group</label>
                                <div className="flex flex-wrap items-center">
                                    {groups.map((group, index) => (
                                    <div className="flex items-center" key={index}>
                                        <input
                                        type="text"
                                        placeholder=""
                                        className={`border ${
                                            errMsg ? 'border-red-500' : 'border-gray-300'
                                            } py-2 px-4 flex-grow focus:outline-none focus:border-blue-500 w-24 ml-2 rounded-lg m-1 md:m-2`}
                                        value={group}
                                        required
                                        onChange={(e) => handleGroupChange(index, e.target.value)}
                                        maxLength={3}
                                        />
                                        {index > 0 && (
                                        <button
                                            type="button"
                                            className="bg-red-500 text-white w-8 h-8 rounded-lg text-sm hover:bg-red-600 flex items-center ml-2 align-middle justify-center"
                                            onClick={() => handleRemoveGroup(index)}
                                        >
                                            <MinusIcon/>
                                        </button>
                                        )}
                                    </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="bg-blue-500 text-white w-8 h-8 rounded-lg text-sm hover:bg-blue-600 flex items-center ml-2 align-middle justify-center"
                                        onClick={handleAddGroup}
                                    >
                                        <PlusIcon/>
                                    </button>
                                </div>
                            </div>
                    </div>
                </form>
            </div>
            <div className="mx-auto rounded-3xl shadow-lg shadow-gray-400/50 md:h-auto flex flex-col mt-4 md:mt-6 w-5/6">

                <button
                    type="submit"
                    className="block bg-gray-200 border border-gray-200 rounded-full p-2 mt-2 md:mt-6 hover:bg-gray-100 transition duration-300 rounded-full flex items-center justify-center text-gray-700 font-bold"
                    onClick={handleSubmit}
                >
                    Create course
                </button>
            </div>
        </>
        )
}      
    
/*
    return (
        <Container className="container-fluid d-flex align-items-center vh-100">
            <Container className='p-3'>
                <Button variant="light mb-3" href="/course">
                    ← Back to courses
                </Button>

                <h1 className={title === "New course" ? "text-muted fw-bold" : "fw-bold"}
                >
                    {title}
                </h1>

                <p className='text-danger'>{errMsg}</p>

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Course title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter title"
                            onChange={handleTitleInput}
                            autoComplete='off'
                            className={errMsg ? 'is-invalid' : ''}
                            required
                        />
                        <Form.Text className="text-muted">
                            Give a short title to your course.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Course description <span className='text-muted'></span></Form.Label>
                        <Form.Control
                            value={description}
                            as="textarea"
                            rows={5}
                            placeholder="Enter description"
                            className={errMsg ? 'is-invalid' : ''}
                            onChange={handleDescriptionInput}
                        />
                        <Form.Text className="text-muted">
                            Markdown supported !&nbsp;
                            <a className='text-muted' href="https://www.markdownguide.org/basic-syntax/">See reference</a>
                        </Form.Text>
                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Create course
                    </Button>
                </Form>
            </Container>
        </Container>)
}
*/
export default CreateCourse