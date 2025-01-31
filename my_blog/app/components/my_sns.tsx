import Image from 'next/image';
import zenn_logo from '../../public/imgs/zenn_logo.svg'
import github_logo from '../../public/imgs/github_logo.svg'
import X_logo from '../../public/imgs/X_logo.png'
import qiita_logo from '../../public/imgs/qiita-icon.png'

const MysnsButton = () => {
    return (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-none md:flex md:justify-center">
            <a href="https://x.com/yuu__dee" target="_blank" rel="noopener noreferrer" className='bg-white text-black px-4 py-2 border border-black rounded flex items-center space-x-2 hover:transform hover:duration-500 hover:scale-110 cursor-pointer'>
                <Image alt="sns_icon" className="w-7 h-7" src={X_logo} />
                <span>X</span>
            </a>
            <a href="https://github.com/yuudee" target="_blank" rel="noopener noreferrer" className='bg-white text-black px-4 py-2 border border-black rounded flex items-center space-x-2 hover:transform hover:duration-500 hover:scale-110 cursor-pointer'>
                <Image alt="sns_icon" className="w-7 h-7" src={github_logo} />
                <span>Github</span>
            </a>
            <a href="https://zenn.dev/yuudee" target="_blank" rel="noopener noreferrer" className="bg-white text-black px-4 py-2 border border-black rounded flex items-center space-x-2 hover:transform hover:duration-500 hover:scale-110 cursor-pointer">
                <Image alt="sns_icon" className="w-7 h-7" src={zenn_logo} />
                <span>Zenn</span>
            </a>
            <a href="https://qiita.com/yuudee" target="_blank" rel="noopener noreferrer" className="bg-white text-black px-4 py-2 border border-black rounded flex items-center space-x-2 hover:transform hover:duration-500 hover:scale-110 cursor-pointer">
                <Image alt="sns_icon" className="w-7 h-7" src={qiita_logo} />
                <span>Qiita</span>
            </a>

        </div>
    )
};

export default MysnsButton;