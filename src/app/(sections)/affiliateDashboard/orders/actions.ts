'use server'

import { db } from "@/db";

export async function getAffiliateOrdersWithCommission(userId: string) {
  try {
    // Find the affiliate based on the userId
    const affiliate = await db.affiliate.findUnique({
      where: { userId },
      include: {
        links: {
          include: {
            commission: {
              include: {
                order: {
                  include : {
                    commission : true
                  }
                } // Include order details
              }
            }
          }
        }
      }
    });

    if (!affiliate) {
      throw new Error("Affiliate not found for this user.");
    }

    // Extract all the orders along with their commission profits
    const ordersWithCommission = affiliate.links
      .flatMap((link) => link.commission)
      .filter((commission) => commission.order !== null) // Ensure orders are not null
      .map((commission) => ({
        order: commission.order,
        commissionProfit: commission.profit,
      }));

    return ordersWithCommission;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching affiliate orders and commissions.");
  }
}