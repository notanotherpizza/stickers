"use client";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, BaseHTMLAttributes } from "react";
import ReactMarkdown from 'react-markdown';

// Using BaseHTMLAttributes to correctly extend HTML element properties
type CodeProps = BaseHTMLAttributes<HTMLElement> & { inline?: boolean; }

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
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="relative w-full max-w-xl transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:max-h-[90vh] max-h-[80vh] overflow-y-auto">
                <div className="absolute right-0 top-0 pr-4 pt-4 block">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-xl font-semibold leading-6 text-gray-900"
                  >
                    {title}
                  </DialogTitle>
                  <div className="mt-2 prose prose-sm max-w-none space-y-2">
                    <ReactMarkdown
                      components={{
                        a: ({ ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-500 underline"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ),
                        p: ({ ...props }) => (
                          <p {...props} className="text-gray-500 text-md" />
                        ),
                        ul: ({ ...props }) => (
                          <ul {...props} className="list-disc pl-5 text-gray-500 text-md" />
                        ),
                        ol: ({ ...props }) => (
                          <ol {...props} className="list-decimal pl-5 text-gray-500 text-md" />
                        ),
                        li: ({ ...props }) => (
                          <li {...props} className="text-gray-500 text-md" />
                        ),
                        code: (props: CodeProps) => (
                          props.inline ? (
                            <code {...props} className="bg-gray-100 rounded px-1 py-0.5 text-sm" />
                          ) : (
                            <code {...props} className="block bg-gray-100 rounded p-2 text-sm overflow-x-auto" />
                          )
                        ),
                        pre: ({ ...props }) => (
                          <pre {...props} className="bg-gray-100 rounded p-2 text-sm overflow-x-auto" />
                        ),
                      }}
                    >
                      {description || ''}
                    </ReactMarkdown>
                  </div>
                </div>
              </DialogPanel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}