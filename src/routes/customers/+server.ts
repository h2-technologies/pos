import { prisma } from '$lib/db';

export async function POST({ locals, request }) {
  if (!locals.session) { return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 }); }
  const { name, phone, email, address } = await request.json();

  if (!name || !phone || !email || !address) { return new Response(JSON.stringify({ success: false, message: "Invalid inputs" }), { status: 400 }); }

  const id = () => {
    const randomNum = Math.floor(Math.random() * (999999 + 1));

    const paddedId = String(randomNum).padStart(6, '0');

    return paddedId;
  }
  const customer = await prisma.customer.create({
    data: {
      id: id(),
      name,
      phone,
      email,
      address
    }
  })

  if (!customer) { return new Response(JSON.stringify({ success: false, message: "Failed to create customer" }), { status: 500 }); }
  return new Response(JSON.stringify({ success: true, message: "Customer created successfully", id: customer.id }), { status: 201 });
}

export async function PUT({ locals, request }) {
  if (!locals.session) { return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 }); }

  const { id, name, phone, email, address } = await request.json();

  const customer = await prisma.customer.update({ 
    where: {
      id: id
    },
    data: {
      name, 
      phone,
      email,
      address
    }
  })

  if (!customer) { return new Response(JSON.stringify({ success: false, message: "Failed to update customer" }), { status: 500 })}
  return new Response(JSON.stringify({ success: true }))
}

export async function DELETE({ locals, request }) {
  if (!locals.session) { return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 }); }
  
  const { id } = await request.json();

  //Mark the customer as inactive for preservation purposes
  const customer = await prisma.customer.update({
    where: {
      id: id
    },
    data: {
      active: false
    }
  })

  if (!customer) { return new Response(JSON.stringify({ success: false, message: "Failed to delete customer" }), { status: 500 }) }
  return new Response(JSON.stringify({ success: true }))
}