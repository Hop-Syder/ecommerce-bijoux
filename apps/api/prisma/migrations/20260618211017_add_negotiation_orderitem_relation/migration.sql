-- AddForeignKey
ALTER TABLE "Negotiation" ADD CONSTRAINT "Negotiation_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
