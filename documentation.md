### Create split effect using Nextjs and Split js

## Introduction

In this article we use Splitjs to create an image split effect in nextjs.

## Codesandbox

Find the project demo on [Codesandbox](/).

<CodeSandbox
title="design cards"
id=" "
/>


You can also find the github repo using [Github](/).

## Prerequisites

Entry-level knowledge in javascript and React/Nextjs.

## Setting Up the Sample Project

Use `npx create-next-app split` to create a new Next.js project and open the project directory using `cd split`
Our project will involve importing pictures and creating a split screen effect using split.js library. A user can then caption the photo at any point and save it online.

Saving the project online will require [Cloudinary](https://cloudinary.com/?ap=em) intergration. Lets begin by coding the intergration in the nextjs backend.

Use this [link](https://cloudinary.com/console) to access the cloudinary website login page. Create a new account or login if you have one anc access your dashboard page. Here you will find the necessary environment variables for your project. To use them you will be required to install `cloudinary` as a dependancy in your project. Head to your project terminal and install it using `npm install cloudinary` . After installation head to your project root directory and create a file named `.env.local` and paste the following codes below. Fill the blanks with the respective environment variable from your dashboard.

```
".env.local"

CLOUDINARY_CLOUD_NAME =

CLOUDINARY_API_KEY =

CLOUDINARY_API_SECRET=
```

Restart your project `npm run dev` 

Create a new file in the `pages/api` directory named `upload.js`.  
We start by configuring cloudinary environment keys and libraries. Paste the following code.
 
```
"pages/api/upload.js"

var cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
```
Create a handler function to execute POST requests.

```
"pages/api/upload.js"

export default async function handler(req, res) {
    if (req.method === "POST") {
        let url = ""
        try {
            let fileStr = req.body.data;
            const uploadedResponse = await cloudinary.uploader.upload_large(
                fileStr,
                {
                    resource_type: "video",
                    chunk_size: 6000000,
                }
            );
            url = uploadedResponse.url
        } catch (error) {
            res.status(500).json({ error: "Something wrong" });
        }

        res.status(200).json({data: url});
    }
}
```
The function above will upload media files from post request body and then upload them to cloudinary. It will also send back a response containing the file's cloudinary link.

Our backend is complete. We can now begin coding our effect.
 


In the `pages/index` directory, start by importing the following
```
"pages/index"

import { forwardRef, useState, createRef, useEffect, useRef } from 'react';
import Split from 'split.js'
```
Notice the `Split` import. Include it in your dependencies using `npm install --save split.js` to avoid errors.

Inside the root component declare the following variables.  
```
"pages/index"

  const captionRef = createRef();
```

The variables above will be attached  to our DOM elements via the `ref` attribute so they can be refferenced throught our component.

Create a function `defaultPictureHandler` as follows
```
"pages/index"

const defaultPictureHandler = async (e) => {
    const file = e.target.files?.item(0);
    console.log(file)
    await readFile(file).then((encoded_file) => {
      document.getElementById("default").style.backgroundImage = `url(${encoded_file})`;
      document.getElementById("picture").style.backgroundImage = `url(${encoded_file})`;
    })
}


  function readFile(file) {
    // console.log("readFile()=>", file);
    return new Promise(function (resolve, reject) {
      let fr = new FileReader();

      fr.onload = function () {
        resolve(fr.result);
      };

      fr.onerror = function () {
        reject(fr);
      };

      fr.readAsDataURL(file);
    });
  }

```

We shall have an `input` element to upload the image file required as a background. The split effect shall ensure two sections of the same or different colored versions that can be splitted horizontally using a `gutter`.

The first upload will appy to both sections thus the function name `defaultPictureHandler`. The function will upload an image file and convert it to base64  using a `file reader` then replace the background of both sections  with the uploaded image.

The Second function will be `pictureHandler` which will simply replace the second section of the gutter with the uploaded image file.

```
"pages/index"

  const pictureHandler = async (e) => {
    const file = e.target.files?.item(0);
    await readFile(file).then((encoded_file) => {
      document.getElementById("picture").style.backgroundImage = `url(${encoded_file})`;
    })
  }
```

At this point, head to your root function return method and replace it with the following :

```
"pages/index"

return(
  <div className="container">
    <div className="flex">
      <div className="default">A</div>
      <div className="picture">B</div>
    </div>
  </div>
)
```
In the class names `default` and  `picture`, we shall include the respective images uploaded by the functions created earlier. Meanwhile, you can tweak your css properties to look like below to view your sections.

```
"styles/global.css"

.container {
  width: 100%;
  height: 100%;
  text-align: center;
  justify-content: center;
}


.flex {
  display: flex;
  flex-direction: row;
  height: 80vh;
  width: 120vh;
  margin-top: 5%;
  margin-left: 25%;
  /* border: 1px solid */
}
#default {
  filter: grayscale(60%);
  background-color: lightseagreen;
 
}

#picture {
  background-color: lightseagreen;
}
```
The above should result to the view below:


![Initial Section](https://res.cloudinary.com/dogjmmett/image/upload/v1648198145/containers_vsoijh.png "Initial Section")

Introducing our split library will create a horizontal gutter line between the two sections which will be used to split the image. The Split method will be included inside a useEffect hook.

```
"pages/index.js"

  useEffect(() => {
    var split = Split(["#default", "#picture"], {
      gutterSize: 5,
      sizes: [25, 50]
    })
  }, [])
```

Once the code above runs you should see a display like below:

![Splitted sections](https://res.cloudinary.com/dogjmmett/image/upload/v1648198142/splitted_c3m1ve.png "Splitted sections")

[Split.js](https://www.npmjs.com/package/split.js?utm_source=cdnjs&utm_medium=cdnjs_link&utm_campaign=cdnjs_library) lets you handle the gutter manually because they do not wish to interfere with your layout. After they figure out the size and include an invisible gutter, the rest is up to you.

```
"styles/global.css"

.gutter.gutter-horizontal {
  background-color: #143040;
  cursor: e-resize;
}
```

The gutter class above will configure the invisible gutter below and to give it a color and configure the cursor shape


![Gutter Line](https://res.cloudinary.com/dogjmmett/image/upload/v1648199243/gutter_a9xy5c.png "Gutter Line")

There are two more properties in our split method namely `gutterSize` and `sizes`. These are used to control the line size and the sizes of each partition respectively. To learn more about these properties and others you can inplement, see the [documentation](https://www.npmjs.com/package/split.js?utm_source=cdnjs&utm_medium=cdnjs_link&utm_campaign=cdnjs_library).


At this point you can dow edit the sections by applying any images you see fit. In our case, we will include a background for our sections to showcase a demo as well as turn the first section to greyscale view. Our two colored versions will therefore be a grey scale and an originally colored photo.

More about configuring the css properties can be found in the github repo.

The final part of the project is to ensure that we can upload a caption of our splited photo to cloudinary. We had already figured out our backend intergration.
Start by downloading the dependencies `html2canvas` and `use-react-screenshot` using
`npm install html2canvas use-react-screenshot`
Inport `useScreenshot` from `use-react-screenshot`: `import { useScreenshot } from 'use-react-screenshot';`

Introduce the following hook inside the root component: `const [caption, takeScreenshot] = useScreenshot();`


Then create the `uploadHandler` function as shown below:

```
"pages/index.js"


 const uploadHandler = async (e) => {
    await takeScreenshot(captionRef.current).then((screenshot) => {
      try {
        fetch('/api/upload', {
          method: 'POST',
          body: JSON.stringify({ data: screenshot }),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data.data)
          })
      } catch (error) {
        console.error(error);
      }
    })
  }

```

The function above will caption the splited image and upload it online. The image will be saved in your cloudinary account media library. You can also view it in your browser`s console.log.

Thats it! We have created our own image split effect. Ensure to go through the project to enjoy the experience. Happy coding!