"use client";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { BaseHTMLAttributes } from "react";
import ReactMarkdown from "react-markdown";

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
    <Dialog open={open} onClose={() => {}}>
      <div className='absolute bottom-0 right-0'>
        <div className='flex items-end justify-center min-h-full text-center sm:items-center sm:p-0'>
          <DialogPanel
            transition
            className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:m-8 sm:w-full sm:max-w-xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95'>
            <div className='absolute top-0 right-0 pt-4 pr-4 block'>
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
                <div className='mt-2 space-y-2 prose prose-sm'>
                  <ReactMarkdown
                    components={{
                      a: (props) => (
                        <a
                          {...props}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-indigo-600 hover:text-indigo-500 underline'
                          onClick={(e) => e.stopPropagation()}
                        />
                      ),
                      p: (props) => (
                        <p {...props} className='text-gray-500 text-md' />
                      ),
                      ul: (props) => (
                        <ul
                          {...props}
                          className='list-disc pl-5 text-gray-500 text-md'
                        />
                      ),
                      ol: (props) => (
                        <ol
                          {...props}
                          className='list-decimal pl-5 text-gray-500 text-md'
                        />
                      ),
                      li: (props) => (
                        <li {...props} className='text-gray-500 text-md' />
                      ),
                      code: (
                        props: BaseHTMLAttributes<HTMLElement> & {
                          inline?: boolean;
                        }
                      ) =>
                        props.inline ? (
                          <code
                            {...props}
                            className='bg-gray-100 rounded px-1 py-0.5 text-sm'
                          />
                        ) : (
                          <code
                            {...props}
                            className='block bg-gray-100 rounded p-2 text-sm overflow-x-auto'
                          />
                        ),
                      pre: (props) => (
                        <pre
                          {...props}
                          className='bg-gray-100 rounded p-2 text-sm overflow-x-auto'
                        />
                      ),
                    }}>
                    {description || ""}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
