import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ListProductUseCase from "./list.product.usecase";

describe("Test list product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);

    const product1 = ProductFactory.createProduct("Book 1", 20);
    const product2 = ProductFactory.createProduct("Book 2", 10);

    await productRepository.create(product1);
    await productRepository.create(product2);

    const output = [
      {
        id: product1.id,
        name: product1.name,
        price: product1.price,
      },
      {
        id: product2.id,
        name: product2.name,
        price: product2.price,
      },
    ];

    const result = await usecase.execute({});

    expect(result.products).toEqual(output);
  });
});
