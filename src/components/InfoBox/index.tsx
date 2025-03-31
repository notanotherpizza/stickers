"use client";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function InfoBox({
  open,
  setOpen,
  title,
  description,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  description?: string;
}) {
  return (
    <Dialog open={open} onClose={() => {}} className="relative z-50">
      <div className='absolute bottom-0 right-0 z-50'>
        <div className='flex items-end justify-center min-h-full text-center sm:items-center sm:p-0'>
          <DialogPanel
            transition
            className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:m-8 sm:w-full sm:max-w-xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95'>
            <div className='absolute top-0 right-0 hidden pt-4 pr-4 sm:block'>
              <button
                type='button'
                onClick={() => setOpen(false)}
                className='text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                <span className='sr-only'>Close</span>
                <XMarkIcon aria-hidden='true' className='size-6' />
              </button>
            </div>
            <div className='flex'>
              <div className='mt-3 text-center sm:mt-0 sm:text-left'>
                <DialogTitle
                  as='h3'
                  className='text-xl font-semibold text-gray-900 sm:w-10/12'>
                  {title}
                </DialogTitle>
                <div className='mt-2 space-y-2'>
                  {description?.split("\n").map((line, i) => (
                    <p key={i} className='text-gray-500 text-md'>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
