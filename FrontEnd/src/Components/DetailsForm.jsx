import axios from 'axios';
import '../StyleSheets/userDetailsCard.css';
import { FaArrowLeft } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToast } from '../ReduxStates/ToastState.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { setLoaderState } from '../ReduxStates/loadingFlagState';
// 
const InitialFormDetails = {
    Name: '',
    Age: '',
    Skills: '',
    Experience: '',
    Email: '',
    LinkedIn: '',
    GitHub: '',
    Website: '',
    Instagram: '',
    About: '',
    ViewProfile: 'Public'
}
// 
const FileNames = {
    ImageFileName: '',
    ResumeFileName: ''
}
const DetailsForm = () => {
    // 
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
    const ThisLocation = useLocation();
    useEffect(() => {
        if (ThisLocation?.state?.ProfileDetails) {
            const { ImageFileName, ResumeFileName, SocialLinks, ...newDetails } = ThisLocation?.state?.ProfileDetails;
            FileNames.ImageFileName = ImageFileName;
            FileNames.ResumeFileName = ResumeFileName;
            setDetailsFormData({ ...newDetails, ...SocialLinks });
        }
    }, [ThisLocation?.state?.ProfileDetails]);
    // 
    useEffect(() => {
        window.addEventListener('resize', () => {
            setScreenWidth(window.innerWidth);
        })
    }, []);
    // 
    function handleFormInput(e) {
        setDetailsFormData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    }
    // 
    function handleVisibilityInput(e) {
        setDetailsFormData(prevState => ({ ...prevState, [e.target.name]: (e.target.checked) ? 'Private' : 'Public' }));
    }
    // 
    function getImage(e) {
        setImageFile(e.target.files[0]);
    }
    // 
    function getPdfFile(e) {
        setPdfFile(e.target.files[0]);
    }
    // 
    async function uploadImage() {
        const ImageData = new FormData();
        ImageData.append('ImageField', ImageFile);
        const ImageUploadResponse = await axios.post('http://localhost:8080/ImageUpload', ImageData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return ImageUploadResponse?.data?.fileName;
    }
    // 
    async function uploadResume() {
        const PdfData = new FormData();
        PdfData.append('PdfField', PdfFile);
        const PdfUploadResponse = await axios.post('http://localhost:8080/pdfUpload', PdfData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return PdfUploadResponse?.data?.fileName;
    }
    // 
    async function uploadDetails(AllDetails) {
        const Response = await axios.post('http://localhost:8080/ProfileDetails/InsertAndUpdate', { AllDetails });
        if (Response.data === 'DetailsInserted!' || Response.data === 'DetailsUpdated!') {
            DispatchLoadingState(setLoaderState(true));
            setTimeout(() => {
                DispatchLoadingState(setLoaderState(false));
                NavigateTo('/DashBoard/ProfileCards');
            }, 1000);
        }
        FileNames.ImageFileName = '';
        FileNames.ResumeFileName = '';
        setDetailsFormData(InitialFormDetails);
    }
    // 
    async function handleFormSubmit(e) {
        e.preventDefault();
        if (!ThisLocation?.state?.ProfileDetails) {
            if (DetailsFormData.Name === '') {
                DispatchToastState(setToast({ State: 'Error', Message: 'Name Field is Required!', Field: 'Name-DetailsForm' }));
                setFormCounter(1);
                return;
            }
            else if (DetailsFormData.Age === '') {
                DispatchToastState(setToast({ State: 'Error', Message: 'Age Field is Required!', Field: 'Age-DetailsForm' }));
                setFormCounter(1);
                return
            }
            else if (DetailsFormData.Skills === '') {
                DispatchToastState(setToast({ State: 'Error', Message: 'Skills Field is Required!', Field: 'Skills-DetailsForm' }));
                setFormCounter(2);
                return
            }
            else if (DetailsFormData.Experience === '') {
                DispatchToastState(setToast({ State: 'Error', Message: 'Experience Field is Required!', Field: 'Experience-DetailsForm' }));
                setFormCounter(2);
                return
            }
            else if (DetailsFormData.Email === '') {
                DispatchToastState(setToast({ State: 'Error', Message: 'Email Field is Required!', Field: 'Email-DetailsForm' }));
                setFormCounter(4);
                return
            }
            else if (DetailsFormData.LinkedIn === '') {
                DispatchToastState(setToast({ State: 'Error', Message: 'LinkedIn Field is Required!', Field: 'LinkedIn-DetailsForm' }));
                setFormCounter(4);
                return
            }
            else if (DetailsFormData.GitHub === '') {
                DispatchToastState(setToast({ State: 'Error', Message: 'GitHub Field is Required!', Field: 'GitHub-DetailsForm' }));
                setFormCounter(4);
                return
            }
            else if (DetailsFormData.Website === '') {
                DispatchToastState(setToast({ State: 'Error', Message: 'Website Field is Required!', Field: 'Website-DetailsForm' }));
                setFormCounter(4);
                return
            }
            else if (DetailsFormData.Instagram === '') {
                DispatchToastState(setToast({ State: 'Error', Message: 'Instagram Field is Required!', Field: 'Instagram-DetailsForm' }));
                setFormCounter(4);
                return
            }
            else if (DetailsFormData.About === '') {
                return DispatchToastState(setToast({ State: 'Error', Message: 'About Field is Required!', Field: 'About-DetailsForm' }));
            }
        }
        try {
            if (ImageFile && PdfFile) {
                FileNames.ImageFileName = await uploadImage();
                FileNames.ResumeFileName = await uploadResume();
                if (FileNames.ImageFileName && FileNames.ResumeFileName) {
                    uploadDetails({ ...DetailsFormData, ...FileNames });
                }
            }
            else {
                if (ImageFile) {
                    FileNames.ImageFileName = await uploadImage();
                    if (FileNames.ImageFileName) {
                        uploadDetails({ ...DetailsFormData, ...FileNames });
                    }
                }
                if (PdfFile) {
                    FileNames.ResumeFileName = await uploadResume();
                    if (FileNames.ResumeFileName) {
                        uploadDetails({ ...DetailsFormData, ...FileNames });
                    }
                }
                else {
                    uploadDetails({ ...DetailsFormData, ...FileNames });
                }
            }
        } catch (error) {
            if (error) {
                switch (error?.response?.data?.File_upload_message) {
                    case 'No Image File Selected!':
                        DispatchToastState(setToast({ State: 'Error', Message: 'No Image File Selected!', Field: 'Image-DetailsForm' }));
                        setFormCounter(3);
                        break;
                    case 'No Pdf File Selected!':
                        DispatchToastState(setToast({ State: 'Error', Message: 'No Pdf File Selected!', Field: 'Pdf-DetailsForm' }));
                        setFormCounter(3);
                        break;
                    case 'Image File size must be less than 3mb!':
                        DispatchToastState(setToast({ State: 'Error', Message: 'Image File size must be less than 3mb!', Field: 'Image-DetailsForm' }));
                        setFormCounter(3);
                        break;
                    case 'Pdf File size must be less than 3mb!':
                        DispatchToastState(setToast({ State: 'Error', Message: 'Pdf File size must be less than 3mb!', Field: 'Pdf-DetailsForm' }));
                        setFormCounter(3);
                        break;
                }
                if (error?.response?.data) {
                    DispatchToastState(setToast({ State: 'Error', Message: error?.response?.data, Field: '' }));
                    setFormCounter(3);
                }
            }
        }
    }
    // 
    return (
        <div className='Profile-Update-Page'>
            <div className='Back-to-Home-Icon mx-2' onClick={() => NavigateTo('/DashBoard/ProfileCards')}>
                <FaArrowLeft />
            </div>
            <h5 className='p-2 px-3 shadow rounded-5 mt-2 bg-primary text-light' data-aos='fade-down'>Edit Your Profile Skillye</h5>
            <form onSubmit={(e) => handleFormSubmit(e)} className='Form-Container'>
                <svg viewBox="0 0 1000 320">
                    <path fill="deepskyblue" d="M0,288L26.7,293.3C53.3,299,107,309,160,293.3C213.3,277,267,235,320,229.3C373.3,224,427,256,480,245.3C533.3,235,587,181,640,144C693.3,107,747,85,800,80C853.3,75,907,85,960,80C1013.3,75,1067,53,1120,69.3C1173.3,85,1227,139,1280,144C1333.3,149,1387,107,1413,85.3L1440,64L1440,0L1413.3,0C1386.7,0,1333,0,1280,0C1226.7,0,1173,0,1120,0C1066.7,0,1013,0,960,0C906.7,0,853,0,800,0C746.7,0,693,0,640,0C586.7,0,533,0,480,0C426.7,0,373,0,320,0C266.7,0,213,0,160,0C106.7,0,53,0,27,0L0,0Z"></path>
                </svg>
                <div className={`Input-Section Section1 ${FormCounter === 1 ? 'section-active' : ''}`}>
                    <label htmlFor="Name">Name</label>
                    <input type="text" name="Name" id="Name" placeholder='Enter Your Name' value={DetailsFormData.Name} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'Name-DetailsForm') ? { border: '2.2px solid #ff3366' } : null} />
                    <label htmlFor="Age">Age</label>
                    <input type="number" name="Age" id="Age" placeholder='Enter Your Age' value={DetailsFormData.Age} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'Age-DetailsForm') ? { border: '2.2px solid #ff3366' } : null} />
                    {
                        ScreenWidth <= 820 &&
                        <>
                            <span className='Form-Btns bg-primary text-light shadow' onClick={() => setFormCounter(pc => pc + 1)}>Continue</span>
                        </>
                    }
                </div>
                <div className={`Input-Section Section2 ${FormCounter === 2 ? 'section-active' : ''}`}>
                    <label htmlFor="Skills">Skills</label>
                    <input type="text" name="Skills" id="Skills" placeholder='Enter Your Skill' value={DetailsFormData.Skills} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'Skills-DetailsForm') ? { border: '2.2px solid #ff3366' } : null} />
                    <label htmlFor="Experience">Experience</label>
                    <input type="number" name="Experience" id="Experience" placeholder='Enter Experience' value={DetailsFormData.Experience} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'Experience-DetailsForm') ? { border: '2.2px solid #ff3366' } : null} />
                    {
                        ScreenWidth <= 820 &&
                        <>
                            <div className='Form-Btns-Container'>
                                <div className='Form-Btns bg-danger text-light shadow' onClick={() => setFormCounter(pc => pc - 1)}>Back</div>
                                <div className='Form-Btns bg-primary text-light shadow' onClick={() => setFormCounter(pc => pc + 1)}>Continue</div>
                            </div>
                        </>
                    }
                </div>
                <div className={`Input-Section Section3 ${FormCounter === 3 ? 'section-active' : ''}`}>
                    <span>File Upload</span>
                    <div className='File-Label-Container'>
                        <label htmlFor="ImageField" style={(showErrorResponse === 'Image-DetailsForm') ? { border: '2.2px solid #ff3366' } : null}>
                            {
                                !ImageFile?.name && <span>
                                    Upload Your <br /> Image
                                </span>
                            }
                            {
                                ImageFile && <span className='FileName-Field'>
                                    {ImageFile?.name}
                                </span>
                            }
                        </label>
                        <label htmlFor="PdfField" style={(showErrorResponse === 'Pdf-DetailsForm') ? { border: '2.2px solid #ff3366' } : null}>
                            {
                                !PdfFile?.name && <span>
                                    Upload Your <br /> Resume
                                </span>
                            }
                            {
                                PdfFile && <span className='FileName-Field'>
                                    {PdfFile?.name}
                                </span>
                            }
                        </label>
                    </div>
                    <input type="file" name="ImageField" accept='.jpeg, .jpg, .png' id="ImageField" onChange={(e) => getImage(e)} />
                    <input type="file" name="PdfField" accept='.pdf' id="PdfField" onChange={(e) => getPdfFile(e)} />
                    {
                        ScreenWidth <= 820 &&
                        <>
                            <div className='Form-Btns-Container'>
                                <div className='Form-Btns bg-danger text-light shadow' onClick={() => setFormCounter(pc => pc - 1)}>Back</div>
                                <div className='Form-Btns bg-primary text-light shadow' onClick={() => setFormCounter(pc => pc + 1)}>Continue</div>
                            </div>
                        </>
                    }
                </div>
                <div className={`Input-Section Section4 social-Links ${FormCounter === 4 ? 'section-active' : ''}`}>
                    <span>Social Links</span>
                    <input type="email" name="Email" id="Email" placeholder='Enter Email' value={DetailsFormData.Email} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'Email-DetailsForm') ? { border: '2.2px solid #ff3366' } : null} />
                    <input type="text" name="LinkedIn" id="LinkedIn" placeholder='Enter LinkedIn' value={DetailsFormData.LinkedIn} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'LinkedIn-DetailsForm') ? { border: '2.2px solid #ff3366' } : null} />
                    <input type="text" name="GitHub" id="GitHub" placeholder='Enter GitHub' value={DetailsFormData.GitHub} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'GitHub-DetailsForm') ? { border: '2.2px solid #ff3366' } : null} />
                    <input type="text" name="Website" id="Website" placeholder='Enter Website' value={DetailsFormData.Website} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'Website-DetailsForm') ? { border: '2.2px solid #ff3366' } : null} />
                    <input type="text" name="Instagram" id="Instagram" placeholder='Enter Instagram' value={DetailsFormData.Instagram} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'Instagram-DetailsForm') ? { border: '2.2px solid #ff3366' } : null} />
                    {
                        ScreenWidth <= 820 &&
                        <>
                            <div className='Form-Btns-Container'>
                                <div className='Form-Btns bg-danger text-light shadow' onClick={() => setFormCounter(pc => pc - 1)}>Back</div>
                                <div className='Form-Btns bg-primary text-light shadow' onClick={() => setFormCounter(pc => pc + 1)}>Continue</div>
                            </div>
                        </>
                    }
                </div>
                <div className={`Input-Section Section5 ${FormCounter === 5 ? 'section-active' : ''}`}>
                    <label htmlFor="About">About</label>
                    <div>
                        <span className='VisibilityBtn-text'>Do you want to make your profile private</span>
                        <input type="checkbox" name="ViewProfile" id="ViewProfile" onChange={(e) => handleVisibilityInput(e)} defaultChecked={ThisLocation?.state?.ProfileDetails?.ViewProfile === 'Private'} />
                        <span className='VisibilityFlag-text'>{(DetailsFormData.ViewProfile === 'Private') ? "On" : "Off"}</span>
                        <label htmlFor="ViewProfile"></label>
                    </div>
                    <textarea name="About" id="About" placeholder='Write about yourself...' value={DetailsFormData.About} onChange={(e) => handleFormInput(e)} style={(showErrorResponse === 'About-DetailsForm') ? { border: '2.2px solid #ff3366' } : null}></textarea>
                    <input type="submit" value="Submit" />
                </div>
            </form>
        </div>
    )
}

export default DetailsForm