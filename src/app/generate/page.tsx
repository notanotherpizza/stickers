"use client";
import { PencilSquareIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import PolygonMaker from "@/components/PolygonMaker";
import { AnnotatedImage } from "@/components/PolygonMaker/utils";

export default function Home() {
  const [annotatedImage, setAnnotatedImage] = useState<AnnotatedImage | null>(
    null
  );

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

  return !annotatedImage ? (
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
  ) : (
    <PolygonMaker img={annotatedImage} />
  );
}
