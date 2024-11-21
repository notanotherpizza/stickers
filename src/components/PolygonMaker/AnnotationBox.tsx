import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { AnnotatedImage } from "./utils";

export default function AnnotationBox({
  index,
  annotation: { title, description, fillStyle },
  onChange,
  moveAnnotation,
  removeAnnotation,
}: {
  index: number;
  annotation: AnnotatedImage["annotations"][0];
  onChange: (field: string, value: string) => void;
  moveAnnotation: (direction: "up" | "down") => void;
  removeAnnotation: () => void;
}) {
  return (
    <div className='w-full bg-white shadow sm:rounded-lg'>
      <div className='px-4 py-5 sm:p-6'>
        <div className='flex justify-between'>
          <div>
            <span
              className='inline-block w-5 h-5 align-text-bottom rounded'
              style={{
                backgroundColor: fillStyle,
              }}></span>
            <h3 className='inline-block pl-2 text-base font-semibold text-gray-900'>
              Annotation #{index + 1}
            </h3>
          </div>
          <div className='flex space-x-4'>
            <button
              type='button'
              onClick={() => moveAnnotation("up")}
              className='text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              <span className='sr-only'>Close</span>
              <ArrowUpCircleIcon aria-hidden='true' className='size-6' />
            </button>
            <button
              type='button'
              onClick={() => moveAnnotation("down")}
              className='text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              <span className='sr-only'>Close</span>
              <ArrowDownCircleIcon aria-hidden='true' className='size-6' />
            </button>
            <button
              type='button'
              onClick={() => removeAnnotation()}
              className='text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              <span className='sr-only'>Close</span>
              <TrashIcon aria-hidden='true' className='size-6' />
            </button>
          </div>
        </div>
        <div className='max-w-xl mt-2 text-sm text-gray-500'>
          <div className='mt-2'>
            <input
              id='stickerName'
              name='stickerName'
              type='text'
              placeholder='Sticker name'
              value={title}
              onChange={(e) => onChange("title", e.target.value)}
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
            />
          </div>
          <div className='mt-2'>
            <textarea
              id='description'
              name='description'
              placeholder='Add the story behind your sticker here, as well as anything else you want like other people to know about it!'
              value={description}
              onChange={(e) => onChange("description", e.target.value)}
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
