import Product from '../models/product.js'

const getAllProductsStatic = async (req, res) => {
    // throw new Error('testing async errors');
    const search = 'ab';
    const products = await Product.find({})
        .sort('name')
        .select('name price')
        .limit(10)
    res.status(200).json({ products, nbHits: products.length });
}

const getAllProducts = async (req, res) => {

    const { featured, company, name, sort, fields, numericFilters } = req.query;

    console.log();
    const queryObject = {};
    console.log(name);

    if (featured) {
        queryObject.featured = featured;
        // queryObject.featured === 'true' ? true : false;
    }
    if (company) {
        queryObject.company = company;
    }
    if (name) {
        console.log('++');
        queryObject.name = { $regex: name, $options: 'i' };
    }


    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '>': '$lte'
        }
        const regex = /\b(<|>|>=|=|<|<=)\b/g;

        let filters = numericFilters.replace(
            regex,
            (match) =>
                `-${operatorMap[match]}-`,
            // console.log(`${operatorMap[match]}`)

        )
        console.log(filters);
        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) }
            }
        })
    }

    console.log(queryObject);
    let result = Product.find(queryObject);

    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    }
    else {
        result = result.sort('createAt');
    }

    if (fields) {
        const fieldList = fields.split(',').join(' ');
        result = result.select(fieldList);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const products = await result;


    res.status(200).json({ products, nbHits: products.length });
}

export { getAllProductsStatic, getAllProducts };
