export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-Us", {
        style: "currency",
        currency: "USD",

    }).format(price)
}