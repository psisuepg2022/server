-- CreateTable
CREATE TABLE "address" (
    "id" UUID NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "district" VARCHAR(100) NOT NULL,
    "public_area" VARCHAR(255) NOT NULL,
    "person_id" UUID NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "address_person_id_key" ON "address"("person_id");

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
