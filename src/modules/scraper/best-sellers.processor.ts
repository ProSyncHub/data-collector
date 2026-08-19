import { prisma } from "@/lib/prisma";

type BrightDataProduct = {
  asin?: string;
  title?: string;
  brand?: string;
  manufacturer?: string;
  description?: string;

  currency?: string;
  initial_price?: number;
  final_price?: number;
  final_price_high?: number;
  discount?: string;

  availability?: string;
  is_available?: boolean;

  rating?: number;
  reviews_count?: number;
  bought_past_month?: number;

  seller_name?: string;
  seller_id?: string;
  number_of_sellers?: number;

  image?: string;
  image_url?: string;
  images?: string[];

  product_dimensions?: string;
  item_weight?: string;

  root_bs_rank?: number;
  bs_rank?: number;
  root_bs_category?: string;
  bs_category?: string;
  badge?: string;

  amazon_choice?: boolean;
  sponsored?: boolean;
  amazon_prime?: boolean;

  url?: string;
  domain?: string;

  features?: unknown;
  product_details?: unknown;
  categories?: unknown;
  category_tree?: unknown;
  subcategory_rank?: unknown;

  [key: string]: unknown;
};

export async function processBestSellerSnapshot(
  snapshotId: string,
  products: BrightDataProduct[]
) {
  const snapshot =
    await prisma.bestSellerSnapshot.findUnique({
      where: {
        snapshotId,
      },
    });

  if (!snapshot) {
    throw new Error(
      `Unknown Bright Data snapshot: ${snapshotId}`
    );
  }

  await prisma.$transaction(
    async (tx) => {
      for (const item of products) {
        if (!item.asin) {
          console.warn(
            "Skipping item without ASIN"
          );

          continue;
        }

        const product =
          await tx.product.upsert({
            where: {
              asin: item.asin,
            },

            create: {
              asin: item.asin,

              title: item.title,
              brand: item.brand,
              manufacturer:
                item.manufacturer,
              description:
                item.description,

              currency:
                item.currency,
              initialPrice:
                item.initial_price,
              finalPrice:
                item.final_price,
              finalPriceHigh:
                item.final_price_high,
              discount:
                item.discount,

              availability:
                item.availability,
              isAvailable:
                item.is_available,

              rating:
                item.rating,
              reviewsCount:
                item.reviews_count,
              boughtPastMonth:
                item.bought_past_month,

              sellerName:
                item.seller_name,
              sellerId:
                item.seller_id,
              numberOfSellers:
                item.number_of_sellers,

              image:
                item.image,
              imageUrl:
                item.image_url,
              images:
                item.images,

              productDimensions:
                item.product_dimensions,
              itemWeight:
                item.item_weight,

              rootBsRank:
                item.root_bs_rank,
              bsRank:
                item.bs_rank,
              rootBsCategory:
                item.root_bs_category,
              bsCategory:
                item.bs_category,
              badge:
                item.badge,

              amazonChoice:
                item.amazon_choice,
              sponsored:
                item.sponsored,
              amazonPrime:
                item.amazon_prime,

              url: item.url,
              domain:
                item.domain,

              features:
                item.features as any,
              productDetails:
                item.product_details as any,
              categories:
                item.categories as any,
              categoryTree:
                item.category_tree as any,
              subcategoryRank:
                item.subcategory_rank as any,

              rawData:
                item as any,
            },

            update: {
              title: item.title,
              brand: item.brand,
              manufacturer:
                item.manufacturer,
              description:
                item.description,

              currency:
                item.currency,
              initialPrice:
                item.initial_price,
              finalPrice:
                item.final_price,
              finalPriceHigh:
                item.final_price_high,
              discount:
                item.discount,

              availability:
                item.availability,
              isAvailable:
                item.is_available,

              rating:
                item.rating,
              reviewsCount:
                item.reviews_count,
              boughtPastMonth:
                item.bought_past_month,

              sellerName:
                item.seller_name,
              sellerId:
                item.seller_id,
              numberOfSellers:
                item.number_of_sellers,

              image:
                item.image,
              imageUrl:
                item.image_url,
              images:
                item.images,

              productDimensions:
                item.product_dimensions,
              itemWeight:
                item.item_weight,

              rootBsRank:
                item.root_bs_rank,
              bsRank:
                item.bs_rank,
              rootBsCategory:
                item.root_bs_category,
              bsCategory:
                item.bs_category,
              badge:
                item.badge,

              amazonChoice:
                item.amazon_choice,
              sponsored:
                item.sponsored,
              amazonPrime:
                item.amazon_prime,

              url: item.url,
              domain:
                item.domain,

              features:
                item.features as any,
              productDetails:
                item.product_details as any,
              categories:
                item.categories as any,
              categoryTree:
                item.category_tree as any,
              subcategoryRank:
                item.subcategory_rank as any,

              rawData:
                item as any,
            },
          });

        await tx.bestSellerItem.upsert({
          where: {
            snapshotId_productId: {
              snapshotId:
                snapshot.id,
              productId:
                product.id,
            },
          },

          create: {
            snapshotId:
              snapshot.id,
            productId:
              product.id,

            rank:
              item.bs_rank,
            rootRank:
              item.root_bs_rank,
            category:
              item.bs_category,
            badge:
              item.badge,
          },

          update: {
            rank:
              item.bs_rank,
            rootRank:
              item.root_bs_rank,
            category:
              item.bs_category,
            badge:
              item.badge,
          },
        });
      }

      await tx.bestSellerSnapshot.update({
        where: {
          id: snapshot.id,
        },

        data: {
          status: "COMPLETED",
          itemCount:
            products.length,
          completedAt:
            new Date(),
        },
      });
    },
    {
      timeout: 120_000,
    }
  );
}