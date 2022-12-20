import * as Yup from 'yup'

export const copyTextToClipboard = async (text) => {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
};


export const ValidateResouceForm = ()=>{

    const initialValue = {
        
    }

}