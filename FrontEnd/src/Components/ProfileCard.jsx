import axios from 'axios';
import '../StyleSheets/ProfileCard.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { FaEdit, FaEnvelope, FaGithub, FaGlobe, FaInstagram, FaLinkedin, FaUser } from 'react-icons/fa';

const ProfileCard = () => {
    const NavigateTo = useNavigate();
    const AnchorTagRef = useRef(null);
    const [AnchorTagFlag, setAnchorTagFlag] = useState(false);
    const [ProfileDetails, setProfileDetails] = useState({});
    const AccessToken = localStorage.getItem('UserAccessToken') || undefined;
    // 
    useEffect(() => {
        if (AccessToken) {
            return async () => {
                const VerifyAccessToken = await axios.get('http://localhost:8080/VerifyToken', {
                    headers: {
                        'Authorization': `Bearer ${AccessToken}`
                    }
                });
                if (VerifyAccessToken.data) {
                    localStorage.setItem('UserAccessToken', VerifyAccessToken.data?.RefreshToken)
                    const ViewProfileResponse = await axios.post('http://localhost:8080/ProfileDetails/ViewProfile', { UserEmail: VerifyAccessToken.data?.VerifiedUser?.Email });
                    setProfileDetails(ViewProfileResponse.data);
                }
            }
        }
    }, []);
    // 
    async function FileDownload(userFileURL) {
        if (AnchorTagFlag) return;
        setAnchorTagFlag(true);
        try {
            const DownloadResponse = await axios.post('http://localhost:8080/ProfileDetails/userResumeDownload', { userFileURL }, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([DownloadResponse.data]));
            AnchorTagRef.current.href = url;
            AnchorTagRef.current.setAttribute('download', 'GokulResume.pdf');
            AnchorTagRef.current.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error);
        }
        finally {
            setAnchorTagFlag(false);
        }
    }
    return (
        <div className="Profile-Card" data-aos='flip-right'>
            <div className="Profile-Image">
                {ProfileDetails.ImageFileName === '' && <FaUser />}
                {ProfileDetails.ImageFileName &&
                    <img src={`http://localhost:8080/Uploads/Images/${ProfileDetails.ImageFileName}`} alt="" />
                }
            </div>
            <svg viewBox="0 0 960 320">
                <path fill="deepskyblue" d="M0,288L26.7,293.3C53.3,299,107,309,160,293.3C213.3,277,267,235,320,229.3C373.3,224,427,256,480,245.3C533.3,235,587,181,640,144C693.3,107,747,85,800,80C853.3,75,907,85,960,80C1013.3,75,1067,53,1120,69.3C1173.3,85,1227,139,1280,144C1333.3,149,1387,107,1413,85.3L1440,64L1440,0L1413.3,0C1386.7,0,1333,0,1280,0C1226.7,0,1173,0,1120,0C1066.7,0,1013,0,960,0C906.7,0,853,0,800,0C746.7,0,693,0,640,0C586.7,0,533,0,480,0C426.7,0,373,0,320,0C266.7,0,213,0,160,0C106.7,0,53,0,27,0L0,0Z"></path>
            </svg>
            <div className="Profile-Content">
                <div className='Profile-Edit-Field'>
                    <div onClick={() => NavigateTo('/DetailsForm')}>
                        <FaEdit />
                        <span style={{ fontSize: '16px', marginTop: '3px', color: 'var(--Color2)' }}>Edit</span>
                    </div>
                    <div className='Resume-Btn' onClick={() => { FileDownload(`${ProfileDetails.PdfFileName}`) }}>
                        <a ref={AnchorTagRef}>Resume</a>
                        <span>Resume</span>
                    </div>
                </div>
                <div className="Name-Age-Field">
                    <div>
                        <span className='fw-bold Text-Header'>Name</span>
                        <br />
                        <p className='Field-Value'>{ProfileDetails?.Name}</p>
                    </div>
                    <div>
                        <span className='fw-bold Text-Header'>Age</span>
                        <br />
                        <p className='Field-Value'>{ProfileDetails?.Age + `${(ProfileDetails?.Age > 1) ? ' Years' : ' Year'}`}</p>
                    </div>
                </div>
                <div className="Professional-Field">
                    <div>
                        <span className='fw-bold Text-Header'>Skill & Position</span>
                        <br />
                        <p className='Field-Value'>{ProfileDetails?.Skills}</p>
                    </div>
                    <div>
                        <span className='fw-bold Text-Header'>Experience</span>
                        <br />
                        <p className='Field-Value'>{String(ProfileDetails?.Experience).padStart(2, 0) + `${(ProfileDetails?.Experience > 1) ? ' Years' : ' Year'}`}</p>
                    </div>
                </div>
                <div className="Email-Field">
                    <div>
                        <span className='fw-bold Text-Header'>Email</span>
                        <br />
                        <p className='Field-Value'>{ProfileDetails?.Email}</p>
                    </div>
                </div>
                <div className="Social-Links-Field">
                    <div>
                        <span className='fw-bold Text-Header'>Social Links</span>
                        <div className='Social-Icons'>
                            <FaLinkedin />
                            <a href={`https://${ProfileDetails?.SocialLinks?.LinkedIn}`} target="_blank" rel="noopener noreferrer"></a>
                        </div>
                        <div className='Social-Icons'>
                            <FaGithub />
                            <a href={`${ProfileDetails?.SocialLinks?.GitHub}`} target="_blank" rel="noopener noreferrer"></a>
                        </div>
                        <div className='Social-Icons'>
                            <FaEnvelope />
                            <a href={`https://${ProfileDetails?.SocialLinks?.Email}`} target="_blank" rel="noopener noreferrer"></a>
                        </div>
                        <div className='Social-Icons'>
                            <FaGlobe />
                            <a href={`${ProfileDetails?.SocialLinks?.Website}`} target="_blank" rel="noopener noreferrer"></a>
                        </div>
                        <div className='Social-Icons'>
                            <FaInstagram />
                            <a href={`${ProfileDetails?.SocialLinks?.Instagram}`} target="_blank" rel="noopener noreferrer"></a>
                        </div>
                    </div>
                </div>
                <div className="About-Field">
                    <div>
                        <span className='fw-bold Text-Header'>About (Tamil Nadu, India)</span>
                        <br />
                        <p>{ProfileDetails?.About}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard