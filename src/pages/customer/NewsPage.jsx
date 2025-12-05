// NewsPage.js (Updated with smaller cropped images)

import React, { useState } from "react";
import { newsData } from "../../services/api/newsData";
import Breadcrumb from "../../components/customer/Breadcrumb";

const NewsItem = ({ news }) => (
  <div className="flex flex-col md:flex-row bg-white p-5 rounded-lg shadow-sm mb-6 border border-gray-100">
    <div className="w-full md:w-1/4 flex-shrink-0 mb-4 md:mb-0">
      <img
        src={news.imageUrl}
        alt={news.title}
        className="w-full h-48 md:h-40 object-cover rounded-lg bg-gray-200"
      />
    </div>
    <div className="md:ml-6 w-full md:w-3/4">
      <p className="text-sm text-gray-500 mb-1">{news.date}</p>
      <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition duration-150">
        <a href={news.link}>{news.title}</a>
      </h3>
      <p className="text-gray-600 mt-2 line-clamp-2">{news.summary}</p>
      <a
        href={news.link}
        className="text-blue-600 font-semibold text-sm mt-3 inline-block hover:text-blue-700 transition duration-150"
      >
        Xem Thêm <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  </div>
);

const NewsPage = () => {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(newsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = newsData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb paths={[{ label: "Home", link: "/" }, { label: "News" }]} />
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Tin tức & Khuyến mãi
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Cập nhật những thông tin mới nhất và thời trang về các chương trình
            ưu đãi hấp dẫn
          </p>
        </header>

        {/* Danh sách Tin tức */}
        <div className="max-w-4xl mx-auto">
          {currentItems.map((news) => (
            <NewsItem key={news.id} news={news} />
          ))}
          {currentItems.length === 0 && (
            <p className="text-center text-gray-500 py-10">
              Không tìm thấy bài viết nào.
            </p>
          )}
        </div>

        {/* Phân trang (Pagination) */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              {/* Nút Previous */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
              </button>

              {/* Các nút số trang */}
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ${
                    page === currentPage
                      ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      : "text-gray-900 ring-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Nút Next */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
