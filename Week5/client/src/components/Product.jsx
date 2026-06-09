export default function Product({ server, product }) {
    return product ? (
        <div className="card w-[320px] bg-base-100 shadow-xl">
            {product.imgstream && (
                <figure className="">
                    <img
                        src={`${server}/api/res/${product.imgstream}`}
                        alt={product.name}
                        className="rounded-lg h-48 w-full object-cover"
                    />
                </figure>
            )}
            <div className="card-body">
                <h2 className="card-title">{product.name}</h2>
                <p className="text-2xl text-right font-bold text-primary">
                    Ksh {
                        Intl.NumberFormat(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(product.price.toFixed(2))
                    }
                </p>
            </div>
        </div>
    ) : (
        <div className="card w-[320px] bg-base-100 shadow-xl">
            <figure className="">
                <div
                    className="skeleton rounded-lg h-48 w-full"
                />
            </figure>
            <div className="card-body">
                <div className="card-title skeleton h-[1em] w-[20ch]"></div>
                <div className="flex flex-col items-end">
                    <div className="
                        skeleton h-[1.5rem]
                        w-[14ch]
                        mt-[12px]
                    "></div>
                </div>
            </div>
        </div>
    )
}
