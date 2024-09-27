"use client";

import { useEffect, useState } from "react";
import pdfjs from "pdfjs-dist";
export default function QuotationExample({ companyProfileId, documentId, versionId, artifactName }: { companyProfileId: string; documentId: string; versionId: string; artifactName: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [render, setRender] = useState<boolean>(false);

  useEffect(() => {
    var url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';

    try {
        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        // The workerSrc property shall be specified.
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url,
        ).toString();

        // Asynchronous download of PDF
        var loadingTask = pdfjs.getDocument(url);
        loadingTask.promise.then(function(pdf) {
          console.log('PDF loaded');

          // Fetch the first page
          var pageNumber = 1;
          pdf.getPage(pageNumber).then(function(page) {
            console.log('Page loaded');

            var scale = 1.5;
            var viewport = page.getViewport({scale: scale});

            // Prepare canvas using PDF page dimensions
            var canvas = document.getElementById('the-canvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            var renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            var renderTask = page.render(renderContext);
            renderTask.promise.then(function () {
              console.log('Page rendered');
            });
          });
        }, function (reason) {
          // PDF loading error
          console.error(reason);
        });
    } catch (e) {
      console.error(e);
    }
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  return (
    <div>
      <button
        onClick={() => {
          setUrl(
            `http://localhost:8080/document-service/v1/${companyProfileId}/documents/${documentId}/versions/${versionId}/debugRenderer/artifact?artifact_name=${artifactName}&timestamp=${Date.now()}`
          );
        }}
      >
        Update
      </button>

      <canvas id="the-canvas"></canvas>
      {/*{render && url && (*/}
      {/*  <Document options={{ withCredentials: true }} file={url} onLoadSuccess={onDocumentLoadSuccess}>*/}
      {/*    <Page pageNumber={pageNumber} />*/}
      {/*  </Document>*/}
      {/*)}*/}
    </div>
  );
}
