import Image from "next/image";
import zenn_logo from '../../public/imgs/zenn_logo.svg'
import github_logo from '../../public/imgs/github_logo.svg'
import X_logo from '../../public/imgs/X_logo.png'
import qiita_logo from '../../public/imgs/qiita-icon.png'

export const Footer = () => {
    return (
        <footer>
            <div className='border-t border-black bg-gray-200'>
                <div className='flex p-4 gap-4 justify-center'>
                    <a href="https://x.com/yuu__dee" target="_blank" rel="noopener noreferrer" className='hover:transform hover:duration-500 hover:scale-110 cursor-pointer'><Image alt="sns_icon" className='w-7 h-7' src={X_logo} /></a>
                    <a href="https://github.com/yuudee" target="_blank" rel="noopener noreferrer" className='hover:transform hover:duration-500 hover:scale-110 cursor-pointer'><Image alt="sns_icon" className='w-7 h-7' src={github_logo} /></a>
                    <a href="https://zenn.dev/yuudee" target="_blank" rel="noopener noreferrer" className='hover:transform hover:duration-500 hover:scale-110 cursor-pointer'><Image alt="sns_icon" className='w-7 h-7' src={zenn_logo} /></a>
                    <a href="https://qiita.com/yuudee" target='_blank' rel="noopener noreferrer" className='hover:transform hover:duration-500 hover:scale-110 cursor-pointer'><Image alt="sns_icon" className='w-7 h-7' src={qiita_logo} /></a>
                </div>
                <p className='flex justify-center text-black'>© 2024 yuudee.net All Rights Reserved.</p>
            </div >
        </footer >
    )
}