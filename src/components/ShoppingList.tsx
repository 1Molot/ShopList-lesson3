import React, {ChangeEvent, useState, KeyboardEvent} from "react";
import {ShoppingListPropsType} from "../../../my-app/src/Typisation";

export const ShoppingList = (props: ShoppingListPropsType) => {
    const mappedGoods = props.goods.map((el, index) => {

        const changeGoodsStatusOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            props.changeGoodsStatus(el.id, e.currentTarget.checked)
        }

        const expectedPriceToNumber = Number(el.expectedPrice.replace('$', '')) // '$5'(какое-то значнение expectedPrice ('$5' - просто пример, у нас там значения, которые сидят в массиве)) -> '5'(результат после replace) -> 5(конечный результат после Number)
        const realPriceToNumber = +el.realPrice.slice(1) /// '$5'(какое-то значнение realPrice ('$5' - просто пример, у нас там значения, которые сидят в массиве)) -> '5'(результат после splice(1)) -> 5(конечный результат унарного плюса - +)
        const styleForPrice = expectedPriceToNumber >= realPriceToNumber ? 'goodPrice' : 'badPrice';

        return (
            <li key={el.id} className={el.inCart ? 'inCart' : ''}>
                <div>
                    <button onClick={() => props.deleteGoods(el.id)}>x</button>
                    <b>{el.title}</b>
                </div>
                <div className={styleForPrice}>expected price: {el.expectedPrice}</div>
                <div className={styleForPrice}>real price: {el.realPrice}</div>
                <span>in cart: </span>
                <input type={'checkbox'} checked={el.inCart} onChange={changeGoodsStatusOnChangeHandler}/>
            </li>
        )
    })

    const [title, setTitle] = useState<string>('')
    const [error, setError] = useState<boolean | string>(false)

    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(false)
    }

    const addGoodsOnClickHandler = () => {
        if (title.trim() !== '') {
            props.addGoods(title.trim())
        } else {
            setError('Title is required!')
        }
        setTitle('')
    }

    const addGoodsOnKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            if (title.trim() !== '') {
                props.addGoods(title)
                setTitle('')
            } else {
                setError('Title is required!')
            }
        }
    }

    // const [goods, setGoods] = useState<GoodsType[]>([
    //     {id: v1(), title: 'Milk', expectedPrice: '$1.99', realPrice: '$1.99', inCart: true},
    //     {id: v1(), title: 'Bread', expectedPrice: '$0.99', realPrice: '$0.89', inCart: true},
    //     {id: v1(), title: 'Coca-Cola', expectedPrice: '$1.49', realPrice: '$1.49', inCart: true},
    //     {id: v1(), title: 'Eggs', expectedPrice: '$2.49', realPrice: '$3.99', inCart: false},
    // ])

    // const goodsInCartWithFilter = props.goods.filter(el => el.inCart === true ? res += (+el.realPrice.slice(1)) : el);
    // const goodsInCartWithFilterAndMap = props.goods.filter(el => el.inCart).map(el => res += (+el.realPrice.slice(1)));

    // const goodsInCart = props.goods.filter(el => el.inCart === true);
    // let sumOfGoodsInCart = 0
    // for (let i = 0; i < goodsInCart.length; i++) {
    //     sumOfGoodsInCart += Number(goodsInCart[i].realPrice.slice(1))
    // }

    const sumOfGoodsInCart = props.goods
        .filter(el => el.inCart === true)
        .reduce((previousValue, current) => previousValue + Number(current.realPrice.slice(1)), 0);

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input
                    value={title}
                    onChange={onChangeInputHandler}
                    onKeyDown={addGoodsOnKeyDownHandler}
                    className={error ? 'error' : ''}
                />
                <button
                    onClick={addGoodsOnClickHandler}
                    disabled={title.trim() === '' || title.length > 15}>
                    add
                </button>
                {error && <div className={'error-message'}>{error}</div>}
                {title.length > 15 && <div>
                    The length is more than 15 letters.<br/>
                    Current length - <strong>{title.length}</strong>
                </div>}
                {sumOfGoodsInCart
                    ? <div>Sum of items in the cart - <strong>{sumOfGoodsInCart}</strong></div>
                    : <div>Please add item in the cart</div>
                }
            </div>
            <ul>
                {mappedGoods}
            </ul>
            <div>
                <button className={props.filter === "All" ? "activeButton" : ""}
                        onClick={() => props.changeFilterValue("All")} disabled={props.filter === "All"}>All
                </button>
                <button className={props.filter === "Not to buy" ? "activeButton" : ""}
                        onClick={() => props.changeFilterValue("Not to buy")}
                        disabled={props.filter === "Not to buy"}>Not to buy
                </button>
                <button className={props.filter === "Bought" ? "activeButton" : ""}
                        onClick={() => props.changeFilterValue("Bought")}
                        disabled={props.filter === "Bought"}>Bought
                </button>
            </div>
        </div>
    )
}