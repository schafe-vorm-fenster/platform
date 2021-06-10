import React from 'react'
import {MdOpenInNew} from 'react-icons/md'

function FilePreview ( {file, type} ) {

  if(!file) {
    return <></>
  }

  if(!file.fileId) {
    return <></>
  }

  if(!file.fileExt) {
    return <></>
  }

  if(!type || !['image', 'download'].includes(type)){
    type = 'all'
  }

  const directDownloadUrl = 'https://drive.google.com/uc?export=download&id=' + file.fileId
  const downloadUrl = 'https://drive.google.com/file/d/' + file.fileId + '/view'

  let viewUrl = null
  if(['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'tif', 'tiff'].includes(file.fileExt)){
    viewUrl = 'https://drive.google.com/uc?export=view&id=' + file.fileId
  }

  return (
    <>
        { viewUrl && (type=='all' || type=='image') &&
          <div id={file._key} className="file" >
            <img className="w-full h-auto" src={viewUrl} />
          </div>
        }
        
        { !viewUrl && (type=='all' || type=='download') &&
          <div id={file._key} className="file mb-1" >
            <a href={downloadUrl} target="_blank"><i className="icon"><MdOpenInNew /></i> {file.title} öffnen</a> 
          </div>
        }
    </>
  )
}

export default FilePreview



/*

            <br/>
            <a href={directDownloadUrl} target="_blank"><i className="icon"><MdFileDownload /></i> {file.title} herunterladen</a>
*/