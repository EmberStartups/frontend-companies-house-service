"use client"
import React, { useState, useRef } from 'react'; // Import useRef

export default function RequestJob() {
    const [companyId, setCompanyId] = useState('');
    const [termsData, setTermsData] = useState(null);
    const [fileError, setFileError] = useState('');
    const [fileName, setFileName] = useState(''); // New state for file name

    const fileInputRef = useRef<HTMLInputElement>(null); // Create a ref for the file input

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            setTermsData(null);
            setFileName(''); 
            return;
        }

        if(file.type !== 'application/json') {
            setFileError('Please upload a JSON file.');
            setTermsData(null);
            setFileName(''); 
            return;
        }

        setFileError('');
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (!e.target) {
                    return;
                }
                const json = JSON.parse(String(e.target.result));
                setTermsData(json);
            } catch (error) {
                setFileError('Invalid JSON file.');
                setTermsData(null);
                setFileName('');
                console.error('Error parsing JSON:', error);
            }
        };
        reader.readAsText(file);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async () => {
        
        if (companyId && termsData) {
            
            const payload = {
                company_id: companyId,
                terms: termsData
            };

            try {
                const response = await fetch('https://y50zvty2m4.execute-api.eu-west-2.amazonaws.com/prod/jobs', {
                    method: 'POST', // Changed to POST
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload), // Send the payload as JSON string
                    cache: 'no-store'
                });
                
                if (!response.ok) {
                    const errorData = await response.json(); 
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                
                setCompanyId('');
                setTermsData(null);
                setFileName('');
                setFileError('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; 
                }
            } catch (error) {
                console.error('Error submitting job request:', error);
                alert(`Error submitting job request: ${error.message}`);
            }


        } else {
            alert('Please fill in all details and upload a valid JSON file for Terms.');
        }
    };

    return (
        <div className='h-min flex flex-col items-center justify-center w-full'>
            <h1 className="text-2xl font-bold">Request Job</h1>

            <div>
                <div className="flex items-center justify-between mt-4">
                    <div className="text-xl font-bold">Company Id:</div>
                    <input
                        className="m-2 px-1 py-1 rounded border-2 border-black"
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div className="text-xl font-bold">Terms:</div>
                    <input
                        type="file"
                        accept=".json"
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                        className="hidden" 
                    />
                    <button
                        type="button" 
                        onClick={handleButtonClick}
                        className="m-2 px-4 py-2 bg-gray-200 text-gray-800 rounded border border-gray-400 hover:bg-gray-300"
                    >
                        {fileName ? `Change File (${fileName})` : 'Upload JSON File'}
                    </button>
                </div>
                {fileError && <p className="text-red-500 text-right mt-1">{fileError}</p>}
                {termsData && (
                    <div className="mt-2 text-sm text-gray-700">
                        <p>File loaded successfully. Preview:</p>
                        <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-50">
                            {JSON.stringify(termsData, null, 1)}
                        </pre>
                    </div>
                )}
            </div>

            <button
                className="mt-6 px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
                onClick={handleSubmit}
            >
                Submit Job Request
            </button>
        </div>
    );
}