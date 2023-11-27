import React from "react";
import Header from "./Header.jsx";
import Form from "./Form.jsx";

const App = () => {
  const generateComic = async (textInput) => {
    try {
      const response = await fetch("http://localhost:5000/generate-comic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: textInput }),
      });

      if (response.ok) {
        const imageUrl = URL.createObjectURL(await response.blob());
        // Handle the generated image URL, e.g., update state or display the image
      } else {
        console.error("Failed to generate comic:", response.statusText);
      }
    } catch (error) {
      console.error("Error generating comic:", error);
    }
  };

  return (
    <div className="app-layout">
      <Header />
      <Form generateComic={generateComic} />
    </div>
  );
};

export default App;
