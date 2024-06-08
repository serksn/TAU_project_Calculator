import { Link } from 'react-router-dom'

const Notfoundpage = () => {
    return (
        <div>
           Данной страница не найдено. Перейти на <Link to="/">главную страницу</Link>
        </div>
    )
}

export default Notfoundpage;