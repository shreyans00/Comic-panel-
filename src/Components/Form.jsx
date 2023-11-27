import React, { useState } from "react";
import axios from "axios";
import "../css/form.css";

const Form = () => {
  const [textInputs, setTextInputs] = useState(Array(10).fill(""));
  const [imageURLs, setImageURLs] = useState([]);

  const handleInputChange = (e, index) => {
    const newInputs = [...textInputs];
    newInputs[index] = e.target.value;
    setTextInputs(newInputs);
  };

  const blobToDataURL = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const fetchComicImage = async (data, index) => {
    try {
      const response = await axios.post(
        "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
        data,
        {
          headers: {
            Accept: "image/png",
            Authorization:
              "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );

      const imageUrl = await blobToDataURL(response.data);

      // Update the imageURLs array with the fetched image URL
      setImageURLs((prevURLs) => {
        const newURLs = [...prevURLs];
        newURLs[index] = imageUrl;
        return newURLs;
      });
    } catch (error) {
      console.error("Error fetching comic image:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fetch comic images for each input
    await Promise.all(
      textInputs.map(async (input, index) => {
        var data = {
          inputs: input,
        };
        await fetchComicImage(data, index);
      })
    );
  };

  return (
    <div className="comic-form">
      <form onSubmit={handleSubmit}>
        <div className="text-box">
          {textInputs.map((input, index) => (
            <div key={index}>
              <label htmlFor={`textInput${index + 1}`}>{`Text for Panel ${
                index + 1
              }:`}</label>
              <textarea
                id={`textInput${index + 1}`}
                value={input}
                onChange={(e) => handleInputChange(e, index)}
                rows="2"
                required
              />
            </div>
          ))}
        </div>
        <button type="submit">Generate Comic</button>
      </form>

      {/* Display fetched images in a grid */}
      <div className="image-grid">
        {imageURLs.map((imageUrl, index) => (
          <img key={index} src={imageUrl} alt={`Comic Panel ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default Form;
