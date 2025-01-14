import React, { Component } from 'react';
import Image from './common/Image';
import Button from './common/Button';
import TextField from './common/TextField';
// import Button from 'react-bootstrap/Button';
// import Image from 'react-bootstrap/Image';
import axios from 'axios';
import { IMAGES_NAMES } from '../data/meme-images';
import { MEME_API_KEY } from '../api_keys';
import './common/Button.css'
import '../styles/MemeForm.css';

const MEME_API_HEADERS = {
    'x-rapidapi-host': 'ronreiter-meme-generator.p.rapidapi.com',
    'x-rapidapi-key': MEME_API_KEY
};

export class MemeForm extends Component {
    state = {
        topValue: '',
        bottomValue: '',
        imageSrc: "https://sanitationsolutions.net/wp-content/uploads/2015/05/empty-image-300x200.png",
        imageFile: null
    };
    
    onChangeTopText = e => {
        this.setState({topValue: e.target.value});
    }

    onChangeBottomText = e => {
        this.setState({bottomValue: e.target.value});
    }

    onChangeFileImage = e => {
        const imageFile = e.target.files[0];
        this.setState({ imageFile });
    }

    onClickRandom = e => {
        const randomImageName = IMAGES_NAMES[Math.floor(Math.random() * IMAGES_NAMES.length)];
        this.getMeme(randomImageName);
    }
    onClickUpload = e => {    
        const { imageFile } = this.state;
        if(imageFile !== null) {
            const imgNameTimeStamp = Date.now() + imageFile.name;
            const formData = new FormData();
            formData.append('image', imageFile, imgNameTimeStamp);
    
            axios.post('https://ronreiter-meme-generator.p.rapidapi.com/images',
            formData, {
                headers: 
                {...MEME_API_HEADERS, 'Content-Type': 'multipart/form-data'}
            })
            .then(response => {
                if(response.data.status === 'success'){
                    this.getMeme(response.data.name);
                } else if(response.data.status === 'error'){
                    this.getMeme(imgNameTimeStamp);
                }
            })
            .catch(err => console.error(err));
        }
    }

    getMeme(imageName) {
        console.log(imageName);
        const { topValue, bottomValue } = this.state;
        axios({
            method: 'GET',
            url: 'https://ronreiter-meme-generator.p.rapidapi.com/meme',
            headers: MEME_API_HEADERS,
            responseType: 'arraybuffer',
            params: {
                meme: imageName,
                top: topValue || '.',
                bottom: bottomValue || '.'
            }
        })
        .then(response => {
            const bufferImage = Buffer.from(response.data, 'binary').toString('base64');
            const image = `data:image/jpeg;base64,${bufferImage}`;
            this.setState({imageSrc: image });
        })
        .catch(err => console.error(err))
    }


    render() {
        const { topValue, bottomValue, imageSrc } = this.state;
        return (
            <div className="meme-form-div">
                <Image className="memeimg" src={imageSrc} />

                <div className="text-field-div">
                <TextField placeholder="Top text" name="top-text" value={topValue} onChange={this.onChangeTopText} />
                <TextField placeholder="Bottom text" name="bottom-text" value={bottomValue} onChange={this.onChangeBottomText} />
                </div>

            
                <div className="btn-div">
                <Button label="Random Meme" onClick={this.onClickRandom} />
                <Button label="Upload Image" onClick={this.onClickUpload} />
                <label  className="main-btn">
                Load image file
                <input id="upload-image" type="file" name="MEME image" onChange={this.onChangeFileImage} />
                </label>
                </div>


            </div>
        )
    }
}

export default MemeForm;

