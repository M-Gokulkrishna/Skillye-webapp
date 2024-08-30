import axios from 'axios';
import '../StyleSheets/userDetailsCard.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToast } from '../ReduxStates/ToastState.js';
import { setLoaderState } from '../ReduxStates/loadingFlagState';
const DetailsForm = () => {
    const InitialFormDetails = {
        NameField: '',
        AgeField: '',
        SkillField: '',
        ExperienceField: '',
        EmailField: '',
        LinkedInField: '',
        GithubField: '',
        WebsiteField: '',
        InstagramField: '',
        AboutField: '',
    }
    const FileNames = {
        ImageFileName: '',
        ResumeFileName: ''
    }
    const NavigateTo = useNavigate();
    const DispatchToastState = useDispatch();
    const DispatchLoadingState = useDispatch();
    const [PdfFile, setPdfFile] = useState(null);
    const [ImageFile, setImageFile] = useState(null);
    const [FormCounter, setFormCounter] = useState(1);
    const [ScreenWidth, setScreenWidth] = useState(window.innerWidth);
    const [DetailsFormData, setDetailsFormData] = useState({ ...InitialFormDetails });
    const showErrorResponse = useSelector(state => state.ToastState.ToastValue.Field);
    // 
    useEffect(() => {
        window.addEventListener('resize', () => {
            setScreenWidth(window.innerWidth);
        })
    }, []);
    // 
    function getImage(e) {
        setImageFile(e.target.files[0]);
    }
    // 
    function getPdfFile(e) {
        setPdfFile(e.target.files[0]);
    }
    // 
    async function handleFormSubmit(e) {
        e.preventDefault();
        if (DetailsFormData.NameField === '') {
            DispatchToastState(setToast({ State: 'Error', Message: 'Name Field is Required!', Field: 'Name-DetailsForm' }));
            setFormCounter(1);
            return;
        }
        else if (DetailsFormData.AgeField === '') {
            DispatchToastState(setToast({ State: 'Error', Message: 'Age Field is Required!', Field: 'Age-DetailsForm' }));
            setFormCounter(1);
            return
        }
        else if (DetailsFormData.SkillField === '') {
            DispatchToastState(setToast({ State: 'Error', Message: 'Skills Field is Required!', Field: 'Skills-DetailsForm' }));
            setFormCounter(2);
            return
        }
        else if (DetailsFormData.ExperienceField === '') {
            DispatchToastState(setToast({ State: 'Error', Message: 'Experience Field is Required!', Field: 'Experience-DetailsForm' }));
            setFormCounter(2);
            return
        }
        else if (DetailsFormData.EmailField === '') {
            DispatchToastState(setToast({ State: 'Error', Message: 'Email Field is Required!', Field: 'Email-DetailsForm' }));
            setFormCounter(3);
            return
        }
        else if (DetailsFormData.LinkedInField === '') {
            DispatchToastState(setToast({ State: 'Error', Message: 'LinkedIn Field is Required!', Field: 'LinkedIn-DetailsForm' }));
            setFormCounter(3);
            return
        }
        else if (DetailsFormData.GithubField === '') {
            DispatchToastState(setToast({ State: 'Error', Message: 'Github Field is Required!', Field: 'Github-DetailsForm' }));
            setFormCounter(3);
            return
        }
        else if (DetailsFormData.WebsiteField === '') {
            DispatchToastState(setToast({ State: 'Error', Message: 'Website Field is Required!', Field: 'Website-DetailsForm' }));
            setFormCounter(3);
            return
        }
        else if (DetailsFormData.InstagramField === '') {
            DispatchToastState(setToast({ State: 'Error', Message: 'Instagram Field is Required!', Field: 'Instagram-DetailsForm' }));
            setFormCounter(3);
            return
        }
        else if (DetailsFormData.AboutField === '') {
            return DispatchToastState(setToast({ State: 'Error', Message: 'About Field is Required!', Field: 'About-DetailsForm' }));
        }
        try {
            const ImageData = new FormData();
            ImageData.append('ImageField', ImageFile);
            const ImageUploadResponse = await axios.post('http://localhost:8080/ImageUpload', ImageData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // 
            const PdfData = new FormData();
            PdfData.append('PdfField', PdfFile);
            const PdfUploadResponse = await axios.post('http://localhost:8080/pdfUpload', PdfData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // 
            if (ImageUploadResponse?.status === 201 && PdfUploadResponse?.status === 201) {
                FileNames.ImageFileName = ImageUploadResponse?.data.fileName;
                FileNames.ResumeFileName = PdfUploadResponse?.data.fileName;
                const Response = await axios.post('http://localhost:8080/ProfileDetails/InsertAndUpdate', { DetailsFormData, FileNames });
                if (Response.data === 'DetailsInserted!' || Response.data === 'DetailsUpdated!') {
                    DispatchLoadingState(setLoaderState(true));
                    setTimeout(() => {
                        DispatchLoadingState(setLoaderState(false));
                        NavigateTo('/DashBoard/ProfileCards');
                    }, 1000);
                }
                setDetailsFormData(InitialFormDetails);
            }
        } catch (error) {
            if (error) {
                switch (error?.response?.data?.Pdf_upload_message) {
                    case 'No Image File Selected!':
                        DispatchToastState(setToast({ State: 'Error', Message: 'No Image File Selected!', Field: 'Image-DetailsForm' }));
                        setFormCounter(4);
                        break;
                    case 'No Pdf File Selected!':
                        DispatchToastState(setToast({ State: 'Error', Message: 'No Pdf File Selected!', Field: 'Pdf-DetailsForm' }));
                        setFormCounter(4);
                        break;
                    case 'Image File size must be less than 3mb!':
                        DispatchToastState(setToast({ State: 'Error', Message: 'Image File size must be less than 3mb!', Field: 'Image-DetailsForm' }));
                        setFormCounter(4);
                        break;
                    case 'Pdf File size must be less than 3mb!':
                        DispatchToastState(setToast({ State: 'Error', Message: 'Pdf File size must be less than 3mb!', Field: 'Pdf-DetailsForm' }));
                        setFormCounter(4);
                        break;
                }
            }
        }
    }
    // 
    function handleFormInput(e) {
        setDetailsFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    }
    // 
    return (
        <div className='Profile-Update-Page'>
            <div className='Back-to-Home-Icon mx-2' onClick={() => NavigateTo('/DashBoard/ProfileCards')}>
                <FaArrowLeft />
            </div>
            <h5 className='p-2 px-5 shadow rounded-5 mt-2 bg-primary text-light' data-aos='fade-down'>Edit Your Profile Skillye</h5>
            {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam animi cupiditate praesentium debitis nihil sint, eum a minus similique totam hic odio veritatis, nam ipsum laborum commodi iure recusandae! Necessitatibus.</p> */}
            <form onSubmit={(e) => handleFormSubmit(e)} className='Form-Container'>
                <svg viewBox="0 0 1000 320">
                    <path fill="deepskyblue" d="M0,288L26.7,293.3C53.3,299,107,309,160,293.3C213.3,277,267,235,320,229.3C373.3,224,427,256,480,245.3C533.3,235,587,181,640,144C693.3,107,747,85,800,80C853.3,75,907,85,960,80C1013.3,75,1067,53,1120,69.3C1173.3,85,1227,139,1280,144C1333.3,149,1387,107,1413,85.3L1440,64L1440,0L1413.3,0C1386.7,0,1333,0,1280,0C1226.7,0,1173,0,1120,0C1066.7,0,1013,0,960,0C906.7,0,853,0,800,0C746.7,0,693,0,640,0C586.7,0,533,0,480,0C426.7,0,373,0,320,0C266.7,0,213,0,160,0C106.7,0,53,0,27,0L0,0Z"></path>
                </svg>
                <div className={`Input-Section Section1 ${FormCounter === 1 ? 'section-active' : ''}`}>
                    <label htmlFor="NameField">Name</label>
                    <input type="text" name="NameField" id="NameField" placeholder='Enter Your Name' value={DetailsFormData.NameField} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'Name-DetailsForm')? {border: '2.2px solid #ff3366'}: null}/>
                    <label htmlFor="AgeField">Age</label>
                    <input type="number" name="AgeField" id="AgeField" placeholder='Enter Your Age' value={DetailsFormData.AgeField} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'Age-DetailsForm')? {border: '2.2px solid #ff3366'}: null}/>
                    {
                        ScreenWidth <= 680 &&
                        <>
                            <span className='Form-Btns bg-primary text-light shadow' onClick={() => setFormCounter(pc => pc + 1)}>Continue</span>
                        </>
                    }
                </div>
                <div className={`Input-Section Section2 ${FormCounter === 2 ? 'section-active' : ''}`}>
                    <label htmlFor="SkillField">Skills</label>
                    <input type="text" name="SkillField" id="SkillField" placeholder='Enter Your Skill' value={DetailsFormData.SkillField} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'Skills-DetailsForm')? {border: '2.2px solid #ff3366'}: null}/>
                    <label htmlFor="ExperienceField">Experience</label>
                    <input type="number" name="ExperienceField" id="ExperienceField" placeholder='Enter Experience' value={DetailsFormData.ExperienceField} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'Experience-DetailsForm')? {border: '2.2px solid #ff3366'}: null}/>
                    {
                        ScreenWidth <= 680 &&
                        <>
                            <div>
                                <div className='Form-Btns bg-danger text-light shadow' onClick={() => setFormCounter(pc => pc - 1)}>Back</div>
                                <div className='Form-Btns bg-primary text-light shadow' onClick={() => setFormCounter(pc => pc + 1)}>Continue</div>
                            </div>
                        </>
                    }
                </div>
                <div className={`Input-Section Section3 ${FormCounter === 4 ? 'section-active' : ''}`}>
                    <span>File Upload</span>
                    <div className='File-Label-Container'>
                        <label htmlFor="ImageField" style={(showErrorResponse === 'Image-DetailsForm')? {border: '2.2px solid #ff3366'}: null}>
                            Upload Your <br /> Image
                        </label>
                        <label htmlFor="PdfField" style={(showErrorResponse === 'Pdf-DetailsForm')? {border: '2.2px solid #ff3366'}: null}>
                            Upload Your <br /> Resume
                        </label>
                    </div>
                    <input type="file" name="ImageField" accept='.jpeg, .jpg, .png' id="ImageField" onChange={(e) => getImage(e)} />
                    <input type="file" name="PdfField" accept='.pdf' id="PdfField" onChange={(e) => getPdfFile(e)} />
                    {
                        ScreenWidth <= 680 &&
                        <>
                            <div>
                                <div className='Form-Btns bg-danger text-light shadow' onClick={() => setFormCounter(pc => pc - 1)}>Back</div>
                                <div className='Form-Btns bg-primary text-light shadow' onClick={() => setFormCounter(pc => pc + 1)}>Continue</div>
                            </div>
                        </>
                    }
                </div>
                <div className={`Input-Section Section4 social-Links ${FormCounter === 3 ? 'section-active' : ''}`}>
                    <span>Social Links</span>
                    <input type="email" name="EmailField" id="EmailField" placeholder='Enter Email' value={DetailsFormData.EmailField} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'Email-DetailsForm') ? { border: '2.2px solid #ff3366' } : null} />
                    <input type="text" name="LinkedInField" id="LinkedInField" placeholder='Enter LinkedIn' value={DetailsFormData.LinkedInField} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'LinkedIn-DetailsForm') ? { border: '2.2px solid #ff3366' } : null} />
                    <input type="text" name="GithubField" id="GithubField" placeholder='Enter Github' value={DetailsFormData.GithubField} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'Github-DetailsForm') ? { border: '2.2px solid #ff3366' } : null} />
                    <input type="text" name="WebsiteField" id="WebsiteField" placeholder='Enter Website' value={DetailsFormData.WebsiteField} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'Website-DetailsForm') ? { border: '2.2px solid #ff3366' } : null} />
                    <input type="text" name="InstagramField" id="InstagramField" placeholder='Enter Instagram' value={DetailsFormData.InstagramField} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'Instagram-DetailsForm') ? { border: '2.2px solid #ff3366' } : null} />
                    {
                        ScreenWidth <= 680 &&
                        <>
                            <div>
                                <div className='Form-Btns bg-danger text-light shadow' onClick={() => setFormCounter(pc => pc - 1)}>Back</div>
                                <div className='Form-Btns bg-primary text-light shadow' onClick={() => setFormCounter(pc => pc + 1)}>Continue</div>
                            </div>
                        </>
                    }
                </div>
                <div className={`Input-Section Section5 ${FormCounter === 5 ? 'section-active' : ''}`}>
                    <label htmlFor="AboutField">About</label>
                    <textarea name="AboutField" id="AboutField" placeholder='Write about yourself...' value={DetailsFormData.AboutField} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'About-DetailsForm')? {border: '2.2px solid #ff3366'}: null}></textarea>
                    <input type="submit" value="Submit" />
                </div>
            </form>
        </div>
    )
}

export default DetailsForm