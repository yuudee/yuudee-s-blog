import Link from "next/link"


const PostCard = ({ title, date, read_time, excerpt, slug }) => {
    return (
        <div className="ml-5 mr-5 mt-5">
            <Link href={`/posts/${slug}`} className="text-blue-500 hover:text-blue-700 font-medium max-h-20">
                <div className="h-full flex flex-col justify-between text-center bg-white border shadow-md rounded-lg p-4 hover:shadow-xl transition-shadow duration-300 cursor-pointer mb-5">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
                    <p className="text-sm text-gray-500 mb-4">Date:{date}</p>
                    <p className="text-sm text-gray-500 mb-4">Read Time:{read_time}</p>
                    <p className="text-gray-700 mb-4">{excerpt}</p>
                    <p>続きを読む →</p>
                </div >
            </Link>
        </div>
    );
};

export default PostCard;