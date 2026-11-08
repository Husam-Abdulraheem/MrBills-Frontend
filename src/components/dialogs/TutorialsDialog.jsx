import { Button, Dialog, DialogPanel, DialogTitle , DialogDescription } from '@headlessui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next';

export default function TutorialsDialog(props) {
  const { t } = useTranslation();
  
  let [isOpen, setIsOpen] = useState(false)

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  return (
    <>
   
        <svg onClick={open} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={"text-[var(--yellow)] " + props?.style}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
        </svg>


        <Dialog open={isOpen} as="div" className="relative z-50 max-h-[50%] focus:outline-none" onClose={close}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <DialogPanel
                transition
                className="w-full max-w-md  rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                >
                <DialogTitle as="h3" className="text-lg font-medium text-white text-end">
                    {props?.title}
                </DialogTitle>
                <DialogDescription as="p" className="mt-2 text-sm text-white text-end">
                    {props?.description}
                </DialogDescription>
                <video autoPlay muted loop className='border-[var(--yellow)] border-2 my-7 rounded-md' >
                    <source src={props?.video} type="video/mp4" />
                </video>
                <div className="mt-4  flex justify-end">
                    <Button
                    className="inline-flex items-center  gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                    onClick={close}
                    >
                    {t('tutorialsDialog.okButton', '!فهمت، شكرا')}
                    </Button>
                </div>
                </DialogPanel>
            </div>
            </div>
        </Dialog>
    </>
  )
}