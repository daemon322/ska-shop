import React from "react";
import { FaStar } from "react-icons/fa";

const CommentsReviews = ({
  comments,
  newComment,
  setNewComment,
  rating,
  setRating,
  handleCommentSubmit,
}) => {
  return (
    <div className="pt-2">
      <h2 className="text-3xl font-bold text-gray-100 dark:text-gray-900">
        Comentarios y valoraciones
      </h2>
      <div className="mt-6">
        {comments.map((comment, index) => (
          <div
            key={index}
            className="p-4 mb-4 bg-gray-200 rounded dark:bg-gray-700"
          >
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {comment.text}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Valoración: {comment.rating} ⭐
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Fecha: {comment.date}
            </p>
          </div>
        ))}
        <div className="mt-4">
          <textarea
            className="w-full p-2 mb-2 text-sm border rounded dark:bg-gray-800 dark:text-gray-200"
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
          ></textarea>
          <div className="flex items-center mb-2">
            <span className="mr-2 text-sm">Valoración:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`mx-1 text-xl ${
                  rating >= star ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
          <button
            onClick={handleCommentSubmit}
            className="px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500"
          >
            Enviar comentario
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsReviews;
