"use client";
import { PencilSquareIcon, PhotoIcon, ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useRef } from "react";
import PolygonMaker from "@/components/PolygonMaker";
import { AnnotatedImage } from "@/components/PolygonMaker/utils";
import Image from 'next/image';

export default function Home() {
  const [annotatedImage, setAnnotatedImage] = useState<AnnotatedImage | null>(
    null
  );
  const [isReplaceImageMode, setIsReplaceImageMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleNewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (!e.target.files?.[0]) {
      alert("No file selected!");
      return;
    }

    reader.readAsDataURL(e.target.files?.[0] as Blob);
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setAnnotatedImage({
          src: readerEvent.target.result as string,
          title: "New Image",
          annotations: [],
        });
      }

      return;
    };

    reader.onerror = (error) => {
      console.error(error);
      alert("An error occurred while reading the file.");
      return;
    };
  };

  const handleExistingFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (!e.target.files?.[0]) {
      alert("No file selected!");
      return;
    }

    reader.readAsText(e.target.files?.[0] as Blob);
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        try {
          setAnnotatedImage(JSON.parse(readerEvent.target.result as string));
        } catch (error) {
          console.error(error);
          alert("An error occurred while reading the file.");
          return;
        }
      }

      return;
    };

    reader.onerror = (error) => {
      console.error(error);
      alert("An error occurred while reading the file.");
      return;
    };
  };

  // New handler for replacing an image in existing annotations
  const handleReplaceImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!annotatedImage) return;
    
    const reader = new FileReader();
    if (!e.target.files?.[0]) {
      alert("No file selected!");
      return;
    }

    reader.readAsDataURL(e.target.files?.[0] as Blob);
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        const img = new window.Image() as HTMLImageElement;
        img.src = readerEvent.target.result as string;
        
        img.onload = () => {
          // Create a canvas to scale the new image to match the original dimensions
          if (!canvasRef.current) return;
          
          const originalImg = new window.Image() as HTMLImageElement;
          originalImg.src = annotatedImage.src;
          
          originalImg.onload = () => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext('2d')!;
            
            // Set canvas dimensions to match original image
            canvas.width = originalImg.width;
            canvas.height = originalImg.height;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw the new image scaled to match original dimensions
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
            
            // Get the scaled image data
            const scaledImage = canvas.toDataURL('image/png');
            
            // Update the annotated image with the new scaled image while preserving annotations
            setAnnotatedImage({
              ...annotatedImage,
              src: scaledImage
            });
            
            setIsReplaceImageMode(false);
          };
        };
      }
    };

    reader.onerror = (error) => {
      console.error(error);
      alert("An error occurred while reading the file.");
    };
  };

  const startReplaceImageMode = () => {
    setIsReplaceImageMode(true);
  };

  const cancelReplaceImageMode = () => {
    setIsReplaceImageMode(false);
  };

  // Main content view with different states
  if (!annotatedImage) {
    // Initial view for creating new or loading existing annotations
    return (
      <div className='flex flex-row items-center justify-center w-screen h-screen'>
        <div className='w-4/12 space-y-3 text-center text-gray-900'>
          <div>
            <h1 className='text-3xl font-semibold'>Click-a-Sticker! Creator</h1>
            <p>Create annotated images to show off your laptop stickers! 🎨</p>
          </div>
          <input
            id='newImage'
            type='file'
            accept='image/*'
            onChange={(e) => handleNewImage(e)}
            className='hidden'
          />
          <input
            id='existingFile'
            type='file'
            accept='application/json'
            onChange={(e) => handleExistingFile(e)}
            className='hidden'
          />
          <div className='flex space-x-2'>
            <button
              onClick={() => document.getElementById("newImage")?.click()}
              type='button'
              className='relative block w-full p-12 text-center border-2 border-gray-500 border-dashed rounded-lg hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              <PhotoIcon className='mx-auto text-gray-600 size-12' />
              <span className='block mt-2 text-sm font-semibold text-gray-900'>
                Select an image and annotate your stickers!
              </span>
            </button>
            <button
              onClick={() => document.getElementById("existingFile")?.click()}
              type='button'
              className='relative block w-full p-12 text-center border-2 border-gray-500 border-dashed rounded-lg hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              <PencilSquareIcon className='mx-auto text-gray-600 size-12' />
              <span className='block mt-2 text-sm font-semibold text-gray-900'>
                Edit an already annotated image!
              </span>
            </button>
          </div>
          <div>
            <p>
              Other, better solutions to do this probably exist, but I wanted to
              make something from scratch to get to grips with <code>canvas</code>
              .
            </p>
            <p>
              Some silly little code by{" "}
              <a href='https://cowsay.io' className='underline'>
                Leo
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    );
  } else if (isReplaceImageMode) {
    // Replace image view
    return (
      <div className='flex flex-row items-center justify-center w-screen h-screen'>
        <div className='w-4/12 space-y-3 text-center text-gray-900'>
          <div>
            <h1 className='text-3xl font-semibold'>Replace Image</h1>
            <p>Update the image while keeping your annotations</p>
          </div>
          
          <div className='flex justify-center my-4'>
            <Image 
              src={annotatedImage.src}
              alt="Current image"
              width={500}
              height={320}
              className='max-h-80 border border-gray-300 rounded-lg'
              priority={true}
            />
          </div>
          
          <input
            id='replaceImage'
            type='file'
            accept='image/*'
            onChange={(e) => handleReplaceImage(e)}
            className='hidden'
          />
          
          <div className='flex space-x-3 justify-center'>
            <button
              onClick={() => document.getElementById("replaceImage")?.click()}
              type='button'
              className='px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              <span className='flex items-center'>
                <PhotoIcon className='w-4 h-4 mr-1' />
                Select New Image
              </span>
            </button>
            
            <button
              onClick={cancelReplaceImageMode}
              type='button'
              className='px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              <span className='flex items-center'>
                <XMarkIcon className='w-4 h-4 mr-1' />
                Cancel
              </span>
            </button>
          </div>
          
          <p className='text-sm text-gray-500'>
            The new image will be automatically scaled to match the dimensions of the original.
          </p>
        </div>
        
        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className='hidden' />
      </div>
    );
  } else {
    // Normal polygon maker view with additional option to replace image
    return (
      <div className="relative">
        <PolygonMaker img={annotatedImage} />
        
        {/* Replace Image button in bottom right corner */}
        <div className='absolute bottom-6 right-6'>
          <button
            onClick={startReplaceImageMode}
            type='button'
            className='px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
            <span className='flex items-center'>
              <ArrowPathIcon className='w-4 h-4 mr-1' />
              Replace Image
            </span>
          </button>
        </div>
      </div>
    );
  }
}