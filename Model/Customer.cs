using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PointOfSale.Model;

public class Customer
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Phone]
    [StringLength(20)]
    public string Phone { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public bool Active { get; set; } = true;

    public virtual ICollection<CustomerNote> Notes { get; set; } = [];
    public virtual ICollection<Order> Orders { get; set; } = [];
}
